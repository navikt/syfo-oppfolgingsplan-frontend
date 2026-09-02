import { cleanup, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import OversiktInnholdForSykmeldt from "@/components/OversiktSide/Sykmeldt/OversiktInnholdForSykmeldt";
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

describe("OversiktInnholdForSykmeldt", () => {
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

    await renderAsync(OversiktInnholdForSykmeldt());

    expect(
      screen.getByRole("heading", {
        name: /Du har ikke en oppfølgingsplan/,
      }),
    ).toBeInTheDocument();
    expect(
      screen.queryByText(/oppfølgingsplaner blir utilgjengelige/),
    ).not.toBeInTheDocument();
  });

  test("viser veiledning når tiltaksgruppen ikke har en aktiv plan", async () => {
    mockHentSykmeldtPlanoversikt.mockResolvedValue(
      lagSykmeldtPlanoversikt(mockOversiktDataTomForSM, new Set(["123456789"])),
    );

    await renderAsync(OversiktInnholdForSykmeldt());

    expect(
      screen.getByRole("heading", {
        name: /Du har ikke en aktiv oppfølgingsplan/,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Dette kan du bidra med" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", {
        name: "Få hjelp med forberedelsene til møtet om oppfølgingsplan",
      }),
    ).toBeInTheDocument();
  });

  test("viser nyeste plan som aktiv og resten under vedtatt heading", async () => {
    mockHentSykmeldtPlanoversikt.mockResolvedValue(
      lagSykmeldtPlanoversikt(mockOversiktDataMedPlanerForSM, new Set()),
    );

    await renderAsync(OversiktInnholdForSykmeldt());

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

    await renderAsync(OversiktInnholdForSykmeldt());

    expect(
      screen.getByText(
        /Aktive og tidligere oppfølgingsplaner blir utilgjengelige når du ikke har hatt sykmelding hos arbeidsgiveren på 6 måneder/,
      ),
    ).toBeInTheDocument();
  });

  test("viser veiledning og samtaleguide for sykmeldte i tiltaksgruppen", async () => {
    mockHentSykmeldtPlanoversikt.mockResolvedValue(
      lagSykmeldtPlanoversikt(
        mockOversiktDataMedPlanerForSM,
        new Set(["123456789"]),
      ),
    );

    await renderAsync(OversiktInnholdForSykmeldt());

    expect(screen.getByText("medvirkningsplikt").tagName).toBe("STRONG");
    expect(
      screen.getByRole("heading", { name: "Dette kan du bidra med" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Ha kontakt med og delta i møter med lederen din."),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", {
        name: "Få hjelp med forberedelsene til møtet om oppfølgingsplan",
      }),
    ).toHaveAttribute("href", expect.stringContaining("Samtaleguide"));
  });

  test("beholder eksisterende innhold utenfor tiltaksgruppen", async () => {
    mockHentSykmeldtPlanoversikt.mockResolvedValue(
      lagSykmeldtPlanoversikt(mockOversiktDataMedPlanerForSM, new Set()),
    );

    await renderAsync(OversiktInnholdForSykmeldt());

    expect(
      screen.getByText(/Lederen din er lovpålagt å lage oppfølgingsplanen/),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { name: "Dette kan du bidra med" }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { name: "Forbered deg til samtalen" }),
    ).not.toBeInTheDocument();
  });

  test("viser gjeldende vurdering både som status og registrert innslag", async () => {
    mockHentSykmeldtPlanoversikt.mockResolvedValue(
      lagSykmeldtPlanoversikt(
        mockOversiktDataMedUnntaksvurderingerForSM,
        alleOrganisasjonerITiltaksgruppe,
      ),
    );

    await renderAsync(OversiktInnholdForSykmeldt());

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
    expect(
      screen.getByRole("link", {
        name: "Lag et forberedelsesskjema til samtalen",
      }),
    ).toBeInTheDocument();
  });

  test("viser gjeldende vurdering og tidligere plan fra samme virksomhet", async () => {
    const virksomhetMedUnntak =
      mockOversiktDataMedUnntaksvurderingerForSM.virksomheter[0];
    const virksomhetMedPlan = mockOversiktDataMedPlanerForSM.virksomheter[0];
    const gjeldendeUnntak = virksomhetMedUnntak?.oppfolgingsplanhendelser[0];
    const tidligerePlan = virksomhetMedPlan?.oppfolgingsplanhendelser[0];

    if (!virksomhetMedUnntak || !gjeldendeUnntak || !tidligerePlan) {
      throw new Error("Forventet mockdata for unntak og tidligere plan");
    }

    mockHentSykmeldtPlanoversikt.mockResolvedValue(
      lagSykmeldtPlanoversikt(
        {
          virksomhetsnumreMedAktivSykmelding: [
            virksomhetMedUnntak.virksomhet.orgNumber,
          ],
          virksomheter: [
            {
              virksomhet: virksomhetMedUnntak.virksomhet,
              oppfolgingsplanhendelser: [gjeldendeUnntak, tidligerePlan],
            },
          ],
        },
        new Set([virksomhetMedUnntak.virksomhet.orgNumber]),
      ),
    );

    await renderAsync(OversiktInnholdForSykmeldt());

    expect(
      screen.getByRole("heading", {
        name: "Nav har fått melding om at det ikke er behov for oppfølgingsplan",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Tidligere oppfølgingsplaner" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        name: "Ikke aktuelt med oppfølgingsplan nå",
      }),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Holmen skole" })).toHaveAttribute(
      "href",
      `/sykmeldt/tidligere-planer/${tidligerePlan.id}`,
    );
  });

  test("prioriterer unntaksforberedelse når én virksomhet har plan og en annen har unntak", async () => {
    const virksomhetMedAktivPlan =
      mockOversiktDataOnlyActiveForSM.virksomheter[0];
    const virksomhetMedUnntak =
      mockOversiktDataMedUnntaksvurderingerForSM.virksomheter[1];

    if (!virksomhetMedAktivPlan || !virksomhetMedUnntak) {
      throw new Error("Forventet mockdata for aktiv plan og unntak");
    }

    mockHentSykmeldtPlanoversikt.mockResolvedValue(
      lagSykmeldtPlanoversikt(
        {
          virksomhetsnumreMedAktivSykmelding: [
            virksomhetMedAktivPlan.virksomhet.orgNumber,
            virksomhetMedUnntak.virksomhet.orgNumber,
          ],
          virksomheter: [virksomhetMedAktivPlan, virksomhetMedUnntak],
        },
        alleOrganisasjonerITiltaksgruppe,
      ),
    );

    await renderAsync(OversiktInnholdForSykmeldt());

    expect(
      screen.getByRole("link", {
        name: "Lag et forberedelsesskjema til samtalen",
      }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("link", {
        name: "Få hjelp med forberedelsene til møtet om oppfølgingsplan",
      }),
    ).not.toBeInTheDocument();
  });

  test("viser tiltaksinnhold og bare unntak fra tiltaksvirksomheter i blandet tilfelle", async () => {
    mockHentSykmeldtPlanoversikt.mockResolvedValue(
      lagSykmeldtPlanoversikt(
        mockOversiktDataMedUnntaksvurderingerForSM,
        new Set(["123456789"]),
      ),
    );

    await renderAsync(OversiktInnholdForSykmeldt());

    expect(
      screen.getAllByRole("heading", {
        name: "Nav har fått melding om at det ikke er behov for oppfølgingsplan",
      }),
    ).toHaveLength(1);
    expect(
      screen.queryByText("Virksomhet: Org.nr. 987654321"),
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Dette kan du bidra med" }),
    ).toBeInTheDocument();
  });
});
