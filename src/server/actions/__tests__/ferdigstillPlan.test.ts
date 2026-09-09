import { logger } from "@navikt/next-logger";
import { revalidatePath } from "next/cache";
import { beforeEach, describe, expect, test, vi } from "vitest";
import {
  getRuntimeErrorOperation,
  RuntimeErrorEvent,
} from "@/common/runtimeErrorEvent";
import type { OppfolgingsplanFormUtfyllt } from "@/schema/oppfolgingsplanForm/formValidationSchemas";
import type { FerdigstillPlanActionPayload } from "../FerdigstillPlanAction";
import { ferdigstillPlanServerAction as ferdigstillPlan } from "../ferdigstillPlan";

const tiltakspakke = { gruppe: "tiltak", erITiltaksgruppe: true } as const;
const ferdigstillPlanServerAction = (
  id: string,
  payload: FerdigstillPlanActionPayload,
) => ferdigstillPlan(id, payload, tiltakspakke);

const tokenXFetchUpdateMock = vi.hoisted(() => vi.fn());

vi.mock("@navikt/next-logger", () => ({
  logger: { error: vi.fn(), info: vi.fn() },
}));

vi.mock("@/env-variables/envHelpers", () => ({
  isLocalOrDemo: false,
}));
vi.mock("@/common/backend-endpoints", () => ({
  getEndpointOppfolgingsplanerForAG: () =>
    "http://oppfolgingsplan-backend/api/v1/oppfolgingsplaner",
}));
vi.mock("@/server/tokenXFetch/tokenXFetchUpdate", () => ({
  tokenXFetchUpdate: tokenXFetchUpdateMock,
}));
vi.mock("next/navigation", () => ({
  redirect: vi.fn(),
}));
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));

const loggerErrorMock = vi.mocked(logger.error);

const formValues: OppfolgingsplanFormUtfyllt = {
  typiskArbeidshverdag: "Kontorarbeid med møter",
  arbeidsoppgaverSomKanUtfores: "Skrivearbeid og telefonmøter",
  arbeidsoppgaverSomIkkeKanUtfores: "Tunge løft",
  tidligereTilrettelegging: "Ergonomisk utstyr",
  tilretteleggingFremover: "Hjemmekontor to dager i uken",
  annenTilrettelegging: "Fleksibel arbeidstid",
  hvordanFolgeOpp: "Ukentlige oppfølgingsmøter",
  evalueringsDato: "2026-10-15",
  harDenAnsatteMedvirket: "ja",
  denAnsatteHarIkkeMedvirketBegrunnelse: "",
};

describe("ferdigstillPlanServerAction evalueringspåminnelse", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    tokenXFetchUpdateMock.mockReset();
    tokenXFetchUpdateMock.mockResolvedValue({ error: null });
  });

  test.each([
    ["Ja", true],
    ["Nei", false],
  ] as const)("sender valgt %s i FormSnapshot", async (_label, value) => {
    const result = await ferdigstillPlanServerAction("narmeste-leder-id", {
      formValues,
      evalueringsDatoIsoString: formValues.evalueringsDato,
      includeIkkeMedvirketBegrunnelseFieldInFormSnapshot: false,
      evalueringPaaminnelse: value,
    });
    expect(result).toEqual({ error: null });
    expect(logger.info).toHaveBeenCalledExactlyOnceWith(
      {
        event_type: "aid_plan_opprettet",
        schema_version: "1",
        tiltakspakke: "OPPFOLGINGSPLAN_TILTAKSPAKKE_1",
        gruppe: "tiltak",
        skjemavariant: "tiltak",
        evaluering_paaminnelse: value ? "ja" : "nei",
      },
      "Opprettelse av plan bekreftet av backend",
    );
    expect(vi.mocked(logger.info).mock.invocationCallOrder[0]).toBeLessThan(
      vi.mocked(revalidatePath).mock.invocationCallOrder[0],
    );
    expect(revalidatePath).toHaveBeenCalledWith(
      "/narmeste-leder-id/aktiv-plan",
    );
    expect(revalidatePath).toHaveBeenCalledWith("/narmeste-leder-id");

    expect(tokenXFetchUpdateMock).toHaveBeenCalledWith(
      expect.objectContaining({
        requestBody: expect.objectContaining({
          evalueringPaaminnelse: value,
        }),
      }),
    );
  });

  test("stopper før backend og logger én bounded feil ved ugyldig leder-ID", async () => {
    const result = await ferdigstillPlanServerAction("   ", {
      formValues,
      evalueringsDatoIsoString: formValues.evalueringsDato,
      includeIkkeMedvirketBegrunnelseFieldInFormSnapshot: false,
      evalueringPaaminnelse: true,
    });

    expect(result).toEqual({
      error: { type: "SERVER_ACTION_INPUT_VALIDATION_ERROR" },
    });
    expect(tokenXFetchUpdateMock).not.toHaveBeenCalled();
    expect(logger.info).not.toHaveBeenCalled();
    expect(revalidatePath).not.toHaveBeenCalled();
    expect(loggerErrorMock).toHaveBeenCalledOnce();
    expect(loggerErrorMock).toHaveBeenCalledWith(
      {
        event_type: RuntimeErrorEvent.OPPFOLGINGSPLAN_FERDIGSTILLING_FAILED,
        operation: getRuntimeErrorOperation(
          RuntimeErrorEvent.OPPFOLGINGSPLAN_FERDIGSTILLING_FAILED,
        ),
        error_code: "SERVER_ACTION_INPUT_VALIDATION_ERROR",
        validation_target: "narmeste_leder_id",
      },
      "Server action input validation failed",
    );
  });

  test("returns a backend error without signalling success or invalidating pages", async () => {
    const failure = { error: { type: "FETCH_NETWORK_ERROR" } };
    tokenXFetchUpdateMock.mockResolvedValue(failure);
    await expect(
      ferdigstillPlanServerAction("leader", {
        formValues,
        evalueringsDatoIsoString: formValues.evalueringsDato,
        includeIkkeMedvirketBegrunnelseFieldInFormSnapshot: false,
        evalueringPaaminnelse: false,
      }),
    ).resolves.toEqual(failure);
    expect(logger.info).not.toHaveBeenCalled();
    expect(revalidatePath).not.toHaveBeenCalled();
  });

  test("does not count an unconfirmed response, but counts before failed revalidation", async () => {
    const payload: FerdigstillPlanActionPayload = {
      formValues,
      evalueringsDatoIsoString: formValues.evalueringsDato,
      includeIkkeMedvirketBegrunnelseFieldInFormSnapshot: false,
      evalueringPaaminnelse: false,
    };
    tokenXFetchUpdateMock.mockRejectedValueOnce(
      new Error("connection interrupted"),
    );
    await expect(
      ferdigstillPlanServerAction("leader", payload),
    ).rejects.toThrow("connection interrupted");
    expect(logger.info).not.toHaveBeenCalled();

    vi.mocked(revalidatePath).mockImplementationOnce(() => {
      throw new Error("cache unavailable");
    });
    await expect(
      ferdigstillPlanServerAction("leader", payload),
    ).rejects.toThrow("cache unavailable");
    expect(logger.info).toHaveBeenCalledOnce();
  });

  test("logger trygg Zod-diagnostikk uten avvist payload", async () => {
    await ferdigstillPlanServerAction("narmeste-leder-id", {
      formValues,
      evalueringsDatoIsoString: "12345678901-sensitive-canary",
      includeIkkeMedvirketBegrunnelseFieldInFormSnapshot: false,
      evalueringPaaminnelse: true,
    });

    expect(tokenXFetchUpdateMock).not.toHaveBeenCalled();
    expect(loggerErrorMock).toHaveBeenCalledOnce();
    expect(loggerErrorMock).toHaveBeenCalledWith(
      expect.objectContaining({
        validation_target: "payload",
        validation_issues: expect.arrayContaining([
          expect.objectContaining({ path: "evalueringsDatoIsoString" }),
        ]),
        validation_issue_count: 1,
      }),
      "Server action input validation failed",
    );
    expect(JSON.stringify(loggerErrorMock.mock.calls[0])).not.toContain(
      "12345678901-sensitive-canary",
    );
  });
});
