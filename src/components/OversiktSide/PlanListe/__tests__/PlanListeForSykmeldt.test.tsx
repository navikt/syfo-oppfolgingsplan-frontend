import { cleanup, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import PlanListeForSykmeldt from "@/components/OversiktSide/PlanListe/PlanListeForSykmeldt";
import { erOrgINavTiltaksgruppe } from "@/server/fetchData/arbeidsgiver/erOrgINavTiltaksgruppe";
import {
  mockOversiktDataMedPlanerForSM,
  mockOversiktDataMedUnntaksvurderingerForSM,
  mockOversiktDataOnlyActiveForSM,
  mockOversiktDataTomForSM,
} from "@/server/fetchData/mockData/mockOversiktData";
import { fetchOppfolgingsplanOversiktForSM } from "@/server/fetchData/sykmeldt/fetchOppfolgingsplanOversiktForSM";
import { renderAsync } from "@/test/test-utils";

const envMock = vi.hoisted(() => ({
  tiltakspakkevurderingFeatureToggleEnabled: false,
}));

vi.mock(
  "@/server/fetchData/sykmeldt/fetchOppfolgingsplanOversiktForSM",
  () => ({
    fetchOppfolgingsplanOversiktForSM: vi.fn(),
  }),
);

vi.mock("next/navigation", async () => {
  const { mockNextNavigation } = await import(
    "@/test/mocks/nextNavigationMock"
  );

  return mockNextNavigation();
});

vi.mock("@/server/fetchData/arbeidsgiver/erOrgINavTiltaksgruppe", () => ({
  erOrgINavTiltaksgruppe: vi.fn(),
}));

vi.mock("@/env-variables/envHelpers", async () => {
  const actual = await vi.importActual<
    typeof import("@/env-variables/envHelpers")
  >("@/env-variables/envHelpers");

  return {
    ...actual,
    isTiltakspakkevurderingFeatureToggleEnabled: () =>
      envMock.tiltakspakkevurderingFeatureToggleEnabled,
  };
});

const mockFetch = vi.mocked(fetchOppfolgingsplanOversiktForSM);
const mockErOrgINavTiltaksgruppe = vi.mocked(erOrgINavTiltaksgruppe);

describe("PlanListeForSykmeldt", () => {
  beforeEach(() => {
    envMock.tiltakspakkevurderingFeatureToggleEnabled = false;
    vi.clearAllMocks();
    mockErOrgINavTiltaksgruppe.mockResolvedValue(false);
  });

  afterEach(() => {
    cleanup();
  });

  test("displays new 6-month SM text for previous plans section", async () => {
    mockFetch.mockResolvedValue(mockOversiktDataMedPlanerForSM);

    await renderAsync(PlanListeForSykmeldt());

    expect(
      screen.getByText(
        /Aktive og tidligere oppfølgingsplaner blir utilgjengelige når du ikke har hatt sykmelding hos arbeidsgiveren på 6 måneder/,
      ),
    ).toBeInTheDocument();
  });

  test("does not display old 4-month/friskmeldt text", async () => {
    mockFetch.mockResolvedValue(mockOversiktDataMedPlanerForSM);

    await renderAsync(PlanListeForSykmeldt());

    expect(
      screen.queryByText(
        /Tidligere planer er tilgjengelige i 4 måneder etter at du er friskmeldt/,
      ),
    ).not.toBeInTheDocument();
  });

  test("does not display previous plans text when no previous plans", async () => {
    mockFetch.mockResolvedValue(mockOversiktDataTomForSM);

    await renderAsync(PlanListeForSykmeldt());

    expect(
      screen.queryByText(/oppfølgingsplaner blir utilgjengelige/),
    ).not.toBeInTheDocument();
  });

  test("displays 6-month SM text when only active plans exist (no previous plans)", async () => {
    mockFetch.mockResolvedValue(mockOversiktDataOnlyActiveForSM);

    await renderAsync(PlanListeForSykmeldt());

    expect(
      screen.getByText(
        /Aktive og tidligere oppfølgingsplaner blir utilgjengelige når du ikke har hatt sykmelding hos arbeidsgiveren på 6 måneder/,
      ),
    ).toBeInTheDocument();
  });

  test("displays 6-month SM text exactly once when both active and previous plans exist", async () => {
    mockFetch.mockResolvedValue(mockOversiktDataMedPlanerForSM);

    await renderAsync(PlanListeForSykmeldt());

    const matches = screen.getAllByText(
      /Aktive og tidligere oppfølgingsplaner blir utilgjengelige når du ikke har hatt sykmelding hos arbeidsgiveren på 6 måneder/,
    );
    expect(matches).toHaveLength(1);
  });

  test("6-month info message renders after plan cards, not before", async () => {
    mockFetch.mockResolvedValue(mockOversiktDataMedPlanerForSM);

    await renderAsync(PlanListeForSykmeldt());

    const previousPlansHeading = screen.getByRole("heading", {
      name: /Historikk/i,
    });
    const infoMessage = screen.getByText(
      /oppfølgingsplaner blir utilgjengelige/,
    );

    // InlineMessage should come after the previous plans heading in DOM order
    expect(
      previousPlansHeading.compareDocumentPosition(infoMessage) &
        Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
  });

  test("shows current messages and history for eligible unntaksvurderinger", async () => {
    envMock.tiltakspakkevurderingFeatureToggleEnabled = true;
    mockErOrgINavTiltaksgruppe.mockResolvedValue(true);
    const unntakMedVirksomhetsnavn =
      mockOversiktDataMedUnntaksvurderingerForSM.unntaksvurderinger[0];
    const unntakUtenVirksomhetsnavn = {
      ...mockOversiktDataMedUnntaksvurderingerForSM.unntaksvurderinger[1],
      organization: { orgNumber: "987654321", orgName: null },
    };
    mockFetch.mockResolvedValue({
      ...mockOversiktDataMedUnntaksvurderingerForSM,
      unntaksvurderinger: [unntakMedVirksomhetsnavn, unntakUtenVirksomhetsnavn],
      gjeldendeUnntaksvurderinger: [
        unntakMedVirksomhetsnavn,
        unntakUtenVirksomhetsnavn,
      ],
    });

    await renderAsync(PlanListeForSykmeldt());

    expect(
      screen.getAllByRole("heading", {
        name: "Nav har fått melding om at det ikke er behov for oppfølgingsplan",
        level: 3,
      }),
    ).toHaveLength(2);
    expect(
      screen.getByText(
        /Lederen din i Holmen skole har meldt fra om at det ikke er behov for å lage en plan/,
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        /Lederen din hos arbeidsgiveren med org.nr. 987654321 har meldt fra om at det ikke er behov for å lage en plan/,
      ),
    ).toBeInTheDocument();
    expect(
      screen.getAllByRole("link", { name: "skrive til oss" }),
    ).toHaveLength(2);
    expect(
      screen.getByRole("heading", { name: "Historikk", level: 3 }),
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
  });

  test("keeps an unntak in history when backend says it is no longer current", async () => {
    envMock.tiltakspakkevurderingFeatureToggleEnabled = true;
    mockErOrgINavTiltaksgruppe.mockResolvedValue(true);
    const unntak =
      mockOversiktDataMedUnntaksvurderingerForSM.unntaksvurderinger[0];
    const newerPlan = {
      ...mockOversiktDataOnlyActiveForSM.aktiveOppfolgingsplaner[0],
      ferdigstiltTidspunkt: "2026-03-01T10:00:00Z",
      organization: unntak.organization,
    };
    mockFetch.mockResolvedValue({
      aktiveOppfolgingsplaner: [newerPlan],
      tidligerePlaner: [],
      unntaksvurderinger: [unntak],
      gjeldendeUnntaksvurderinger: [],
    });

    await renderAsync(PlanListeForSykmeldt());

    expect(
      screen.queryByRole("heading", {
        name: "Nav har fått melding om at det ikke er behov for oppfølgingsplan",
      }),
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Historikk", level: 3 }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        name: "Ikke aktuelt med oppfølgingsplan nå",
        level: 4,
      }),
    ).toBeInTheDocument();
  });

  test("does not restore an old unntak when backend returns an expired plan only in history", async () => {
    envMock.tiltakspakkevurderingFeatureToggleEnabled = true;
    mockErOrgINavTiltaksgruppe.mockResolvedValue(true);
    const unntak =
      mockOversiktDataMedUnntaksvurderingerForSM.unntaksvurderinger[0];
    const nyereTidligerePlan = {
      ...mockOversiktDataOnlyActiveForSM.aktiveOppfolgingsplaner[0],
      ferdigstiltTidspunkt: "2026-03-01T10:00:00Z",
      organization: unntak.organization,
    };
    mockFetch.mockResolvedValue({
      aktiveOppfolgingsplaner: [],
      tidligerePlaner: [nyereTidligerePlan],
      unntaksvurderinger: [unntak],
      gjeldendeUnntaksvurderinger: [],
    });

    await renderAsync(PlanListeForSykmeldt());

    expect(
      screen.queryByRole("heading", {
        name: "Nav har fått melding om at det ikke er behov for oppfølgingsplan",
      }),
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        name: "Ikke aktuelt med oppfølgingsplan nå",
        level: 4,
      }),
    ).toBeInTheDocument();
  });

  test("checks Flaggskipet once per organization while retaining every history entry", async () => {
    envMock.tiltakspakkevurderingFeatureToggleEnabled = true;
    mockErOrgINavTiltaksgruppe.mockResolvedValue(true);
    const newestUnntak =
      mockOversiktDataMedUnntaksvurderingerForSM.unntaksvurderinger[0];
    const olderUnntak = {
      ...newestUnntak,
      id: "323e4567-e89b-12d3-a456-426614174099",
      meldtTidspunkt: "2025-12-01T09:12:00Z",
    };
    mockFetch.mockResolvedValue({
      aktiveOppfolgingsplaner: [],
      tidligerePlaner: [],
      unntaksvurderinger: [olderUnntak, newestUnntak],
      gjeldendeUnntaksvurderinger: [newestUnntak],
    });

    await renderAsync(PlanListeForSykmeldt());

    expect(mockErOrgINavTiltaksgruppe).toHaveBeenCalledOnce();
    expect(mockErOrgINavTiltaksgruppe).toHaveBeenCalledWith(
      newestUnntak.organization.orgNumber,
    );
    expect(
      screen.getAllByRole("heading", {
        name: "Nav har fått melding om at det ikke er behov for oppfølgingsplan",
      }),
    ).toHaveLength(1);
    expect(
      screen.getAllByRole("heading", {
        name: "Ikke aktuelt med oppfølgingsplan nå",
      }),
    ).toHaveLength(2);
  });

  test("does not show unntaksvurderinger when the release toggle is disabled", async () => {
    mockFetch.mockResolvedValue(mockOversiktDataMedUnntaksvurderingerForSM);

    await renderAsync(PlanListeForSykmeldt());

    expect(
      screen.queryByRole("heading", {
        name: "Nav har fått melding om at det ikke er behov for oppfølgingsplan",
      }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("heading", {
        name: "Ikke aktuelt med oppfølgingsplan nå",
      }),
    ).not.toBeInTheDocument();
    expect(mockErOrgINavTiltaksgruppe).not.toHaveBeenCalled();
  });

  test("does not show unntaksvurderinger outside the tiltaksgruppe", async () => {
    envMock.tiltakspakkevurderingFeatureToggleEnabled = true;
    mockFetch.mockResolvedValue(mockOversiktDataMedUnntaksvurderingerForSM);

    await renderAsync(PlanListeForSykmeldt());

    expect(
      screen.queryByRole("heading", {
        name: "Nav har fått melding om at det ikke er behov for oppfølgingsplan",
      }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("heading", {
        name: "Ikke aktuelt med oppfølgingsplan nå",
      }),
    ).not.toBeInTheDocument();
  });

  test("does not show the generic empty-plan message when eligible unntaksvurderinger are shown", async () => {
    envMock.tiltakspakkevurderingFeatureToggleEnabled = true;
    mockErOrgINavTiltaksgruppe.mockResolvedValue(true);
    mockFetch.mockResolvedValue(mockOversiktDataMedUnntaksvurderingerForSM);

    await renderAsync(PlanListeForSykmeldt());

    expect(
      screen.getAllByRole("heading", {
        name: "Nav har fått melding om at det ikke er behov for oppfølgingsplan",
        level: 3,
      }),
    ).toHaveLength(2);
    expect(
      screen.queryByRole("heading", {
        name: "Du har ikke en oppfølgingsplan",
      }),
    ).not.toBeInTheDocument();
  });
});
