import { beforeEach, describe, expect, test, vi } from "vitest";
import type { OppfolgingsplanFormUtfyllt } from "@/schema/oppfolgingsplanForm/formValidationSchemas";
import { ferdigstillPlanServerAction } from "../ferdigstillPlan";

const tokenXFetchUpdateMock = vi.hoisted(() => vi.fn());

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
          evalueringPaaminnelse: value,
        }),
      }),
    );
  });
});
