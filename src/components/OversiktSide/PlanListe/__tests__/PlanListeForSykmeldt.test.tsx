import { cleanup, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import PlanListeForSykmeldt from "@/components/OversiktSide/PlanListe/PlanListeForSykmeldt";
import {
  mockOversiktDataMedPlanerForSM,
  mockOversiktDataMedUnntaksvurderingerForSM,
  mockOversiktDataOnlyActiveForSM,
  mockOversiktDataTomForSM,
} from "@/server/fetchData/mockData/mockOversiktData";
import { hentSykmeldtPlanoversikt } from "@/server/fetchData/sykmeldt/hentSykmeldtPlanoversikt";
import { lagSykmeldtPlanoversikt } from "@/server/fetchData/sykmeldt/lagSykmeldtPlanoversikt";
import { renderAsync } from "@/test/test-utils";

vi.mock("@/server/fetchData/sykmeldt/hentSykmeldtPlanoversikt", () => ({
  hentSykmeldtPlanoversikt: vi.fn(),
}));

vi.mock("next/navigation", async () => {
  const { mockNextNavigation } = await import(
    "@/test/mocks/nextNavigationMock"
  );
  return mockNextNavigation();
});

const mockHentSykmeldtPlanoversikt = vi.mocked(hentSykmeldtPlanoversikt);
const alleOrganisasjonerITiltaksgruppe = new Set(["123456789", "987654321"]);

describe("PlanListeForSykmeldt", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  test("viser tomtilstand når det ikke finnes en gjeldende hendelse", async () => {
    mockHentSykmeldtPlanoversikt.mockResolvedValue(
      lagSykmeldtPlanoversikt(mockOversiktDataTomForSM, new Set()),
    );

    await renderAsync(PlanListeForSykmeldt());

    expect(
      screen.getByRole("heading", { name: "Du har ikke en oppfølgingsplan" }),
    ).toBeInTheDocument();
    expect(
      screen.queryByText(/oppfølgingsplaner blir utilgjengelige/),
    ).not.toBeInTheDocument();
  });

  test("viser nyeste plan som aktiv og resten under vedtatt heading", async () => {
    mockHentSykmeldtPlanoversikt.mockResolvedValue(
      lagSykmeldtPlanoversikt(mockOversiktDataMedPlanerForSM, new Set()),
    );

    await renderAsync(PlanListeForSykmeldt());

    const heading = screen.getByRole("heading", {
      name: "Tidligere oppfølgingsplaner",
      level: 3,
    });
    const infoMessage = screen.getByText(
      /oppfølgingsplaner blir utilgjengelige/,
    );
    expect(
      screen.queryByRole("heading", { name: "Historikk" }),
    ).not.toBeInTheDocument();
    expect(
      heading.compareDocumentPosition(infoMessage) &
        Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
  });

  test("viser seksmånedersinformasjon også når bare aktiv plan finnes", async () => {
    mockHentSykmeldtPlanoversikt.mockResolvedValue(
      lagSykmeldtPlanoversikt(mockOversiktDataOnlyActiveForSM, new Set()),
    );

    await renderAsync(PlanListeForSykmeldt());

    expect(
      screen.getByText(
        /Aktive og tidligere oppfølgingsplaner blir utilgjengelige når du ikke har hatt sykmelding hos arbeidsgiveren på 6 måneder/,
      ),
    ).toBeInTheDocument();
  });

  test("viser gjeldende vurdering både som status og registrert innslag", async () => {
    mockHentSykmeldtPlanoversikt.mockResolvedValue(
      lagSykmeldtPlanoversikt(
        mockOversiktDataMedUnntaksvurderingerForSM,
        alleOrganisasjonerITiltaksgruppe,
      ),
    );

    await renderAsync(PlanListeForSykmeldt());

    expect(
      screen.getAllByRole("heading", {
        name: "Nav har fått melding om at det ikke er behov for oppfølgingsplan",
        level: 3,
      }),
    ).toHaveLength(2);
    expect(
      screen.getByRole("heading", {
        name: "Tidligere oppfølgingsplaner",
        level: 3,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getAllByRole("heading", {
        name: "Ikke aktuelt med oppfølgingsplan nå",
        level: 4,
      }),
    ).toHaveLength(2);
    expect(screen.getByText("Virksomhet: Holmen skole")).toBeInTheDocument();
    expect(
      screen.getByText("Virksomhet: Org.nr. 987654321"),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { name: "Du har ikke en oppfølgingsplan" }),
    ).not.toBeInTheDocument();
  });

  test("viser bare virksomheter i tiltaksgruppen", async () => {
    mockHentSykmeldtPlanoversikt.mockResolvedValue(
      lagSykmeldtPlanoversikt(
        mockOversiktDataMedUnntaksvurderingerForSM,
        new Set(["123456789"]),
      ),
    );

    await renderAsync(PlanListeForSykmeldt());

    expect(
      screen.getAllByRole("heading", {
        name: "Nav har fått melding om at det ikke er behov for oppfølgingsplan",
      }),
    ).toHaveLength(1);
    expect(
      screen.queryByText("Virksomhet: Org.nr. 987654321"),
    ).not.toBeInTheDocument();
  });
});
