import { logger } from "@navikt/next-logger";
import { beforeEach, describe, expect, test, vi } from "vitest";
import {
  getRuntimeErrorOperation,
  RuntimeErrorEvent,
} from "@/common/runtimeErrorEvent";
import type { OppfolgingsplanFormUtfyllt } from "@/schema/oppfolgingsplanForm/formValidationSchemas";
import { ferdigstillPlanServerAction } from "../ferdigstillPlan";

const tokenXFetchUpdateMock = vi.hoisted(() => vi.fn());

vi.mock("@navikt/next-logger", () => ({
  logger: { error: vi.fn() },
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
    await ferdigstillPlanServerAction("narmeste-leder-id", {
      formValues,
      evalueringsDatoIsoString: formValues.evalueringsDato,
      includeIkkeMedvirketBegrunnelseFieldInFormSnapshot: false,
      evalueringPaaminnelse: value,
    });

    expect(tokenXFetchUpdateMock).toHaveBeenCalledWith(
      expect.objectContaining({
        requestBody: expect.objectContaining({
          content: expect.objectContaining({ evalueringPaaminnelse: value }),
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

  test("logger ikke avvist payload eller Zod-detaljer", async () => {
    await ferdigstillPlanServerAction("narmeste-leder-id", {
      formValues,
      evalueringsDatoIsoString: "12345678901-sensitive-canary",
      includeIkkeMedvirketBegrunnelseFieldInFormSnapshot: false,
      evalueringPaaminnelse: true,
    });

    expect(tokenXFetchUpdateMock).not.toHaveBeenCalled();
    expect(loggerErrorMock).toHaveBeenCalledOnce();
    expect(loggerErrorMock).toHaveBeenCalledWith(
      expect.objectContaining({ validation_target: "payload" }),
      "Server action input validation failed",
    );
    expect(JSON.stringify(loggerErrorMock.mock.calls[0])).not.toContain(
      "12345678901-sensitive-canary",
    );
  });
});
