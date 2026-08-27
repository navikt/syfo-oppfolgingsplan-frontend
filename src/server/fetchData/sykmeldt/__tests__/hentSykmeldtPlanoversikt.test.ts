import { beforeEach, describe, expect, test, vi } from "vitest";
import {
  mockOversiktDataMedPlanerForSM,
  mockOversiktDataMedUnntaksvurderingerForSM,
} from "@/server/fetchData/mockData/mockOversiktData";
import { finnOrganisasjonerITiltaksgruppe } from "@/server/fetchData/tiltakspakke/finnOrganisasjonerITiltaksgruppe";
import { fetchOppfolgingsplanOversiktForSM } from "../fetchOppfolgingsplanOversiktForSM";
import { hentSykmeldtPlanoversikt } from "../hentSykmeldtPlanoversikt";

const envMock = vi.hoisted(() => ({ enabled: false }));

vi.mock("../fetchOppfolgingsplanOversiktForSM", () => ({
  fetchOppfolgingsplanOversiktForSM: vi.fn(),
}));
vi.mock(
  "@/server/fetchData/tiltakspakke/finnOrganisasjonerITiltaksgruppe",
  () => ({
    finnOrganisasjonerITiltaksgruppe: vi.fn(),
  }),
);
vi.mock("@/env-variables/envHelpers", async () => {
  const actual = await vi.importActual<
    typeof import("@/env-variables/envHelpers")
  >("@/env-variables/envHelpers");
  return {
    ...actual,
    isTiltakspakkevurderingFeatureToggleEnabled: () => envMock.enabled,
  };
});

const fetchMock = vi.mocked(fetchOppfolgingsplanOversiktForSM);
const finnTiltaksgruppeMock = vi.mocked(finnOrganisasjonerITiltaksgruppe);

describe("hentSykmeldtPlanoversikt", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    envMock.enabled = false;
    fetchMock.mockResolvedValue(mockOversiktDataMedUnntaksvurderingerForSM);
    finnTiltaksgruppeMock.mockResolvedValue(
      new Set(["123456789", "987654321"]),
    );
  });

  test("slår opp alle relevante virksomheter i én batch", async () => {
    envMock.enabled = true;

    const resultat = await hentSykmeldtPlanoversikt();

    expect(finnTiltaksgruppeMock).toHaveBeenCalledOnce();
    expect(finnTiltaksgruppeMock).toHaveBeenCalledWith([
      "123456789",
      "987654321",
    ]);
    expect(resultat.gjeldendeHendelser).toHaveLength(2);
    expect(resultat.harMinstEnVirksomhetITiltaksgruppe).toBe(true);
  });

  test("slår opp tiltaksgruppe også når virksomheten har en aktiv plan", async () => {
    envMock.enabled = true;
    fetchMock.mockResolvedValue(mockOversiktDataMedPlanerForSM);
    finnTiltaksgruppeMock.mockResolvedValue(new Set(["123456789"]));

    const resultat = await hentSykmeldtPlanoversikt();

    expect(finnTiltaksgruppeMock).toHaveBeenCalledWith(["123456789"]);
    expect(resultat.harMinstEnVirksomhetITiltaksgruppe).toBe(true);
  });

  test("hopper over Flaggskipet og skjuler tiltaket når toggelen er av", async () => {
    const resultat = await hentSykmeldtPlanoversikt();

    expect(finnTiltaksgruppeMock).not.toHaveBeenCalled();
    expect(resultat.gjeldendeHendelser).toEqual([]);
    expect(resultat.harMinstEnVirksomhetITiltaksgruppe).toBe(false);
  });
});
