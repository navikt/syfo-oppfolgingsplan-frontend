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

  test("velger tiltaksinnhold uten planer når en aktiv virksomhet er i tiltaksgruppen", async () => {
    envMock.enabled = true;
    fetchMock.mockResolvedValue({
      virksomheter: [],
      virksomhetsnumreMedAktivSykmelding: ["111111111"],
    });
    finnTiltaksgruppeMock.mockResolvedValue(new Set(["111111111"]));

    const resultat = await hentSykmeldtPlanoversikt();

    expect(finnTiltaksgruppeMock).toHaveBeenCalledWith(["111111111"]);
    expect(resultat.harMinstEnVirksomhetITiltaksgruppe).toBe(true);
    expect(resultat.gjeldendeHendelser).toEqual([]);
  });

  test("velger tiltaksinnhold når bare en annen virksomhet har plan", async () => {
    envMock.enabled = true;
    fetchMock.mockResolvedValue({
      ...mockOversiktDataMedPlanerForSM,
      virksomhetsnumreMedAktivSykmelding: ["987654321"],
    });
    finnTiltaksgruppeMock.mockResolvedValue(new Set(["987654321"]));

    const resultat = await hentSykmeldtPlanoversikt();

    expect(finnTiltaksgruppeMock).toHaveBeenCalledWith(["987654321"]);
    expect(resultat.harMinstEnVirksomhetITiltaksgruppe).toBe(true);
    expect(resultat.gjeldendeHendelser).toHaveLength(1);
  });

  test("velger ikke tiltaksinnhold når ingen aktiv virksomhet er i tiltaksgruppen", async () => {
    envMock.enabled = true;
    fetchMock.mockResolvedValue({
      virksomheter: [],
      virksomhetsnumreMedAktivSykmelding: ["111111111"],
    });
    finnTiltaksgruppeMock.mockResolvedValue(new Set());

    const resultat = await hentSykmeldtPlanoversikt();

    expect(finnTiltaksgruppeMock).toHaveBeenCalledWith(["111111111"]);
    expect(resultat.harMinstEnVirksomhetITiltaksgruppe).toBe(false);
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
    fetchMock.mockResolvedValue({
      virksomheter: [],
      virksomhetsnumreMedAktivSykmelding: ["111111111"],
    });

    const resultat = await hentSykmeldtPlanoversikt();

    expect(finnTiltaksgruppeMock).not.toHaveBeenCalled();
    expect(resultat.gjeldendeHendelser).toEqual([]);
    expect(resultat.harMinstEnVirksomhetITiltaksgruppe).toBe(false);
  });
});
