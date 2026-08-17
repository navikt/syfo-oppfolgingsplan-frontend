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
      name: /Tidligere oppfølgingsplaner/i,
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

  test("shows eligible unntaksvurderinger with organization and contact guidance", async () => {
    envMock.tiltakspakkevurderingFeatureToggleEnabled = true;
    mockErOrgINavTiltaksgruppe.mockResolvedValue(true);
    mockFetch.mockResolvedValue({
      ...mockOversiktDataMedUnntaksvurderingerForSM,
      unntaksvurderinger: [
        mockOversiktDataMedUnntaksvurderingerForSM.unntaksvurderinger[0],
        {
          ...mockOversiktDataMedUnntaksvurderingerForSM.unntaksvurderinger[1],
          organization: { orgNumber: "987654321", orgName: null },
        },
      ],
    });

    await renderAsync(PlanListeForSykmeldt());

    expect(
      screen.getAllByRole("heading", {
        name: "Oppfølgingsplan er foreløpig ikke aktuell",
        level: 3,
      }),
    ).toHaveLength(2);
    expect(
      screen.getByText(
        /Lederen din i Holmen skole har vurdert at en oppfølgingsplan ikke er nødvendig nå/,
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        /Lederen din hos arbeidsgiveren med org.nr. 987654321 har vurdert at en oppfølgingsplan ikke er nødvendig nå/,
      ),
    ).toBeInTheDocument();
    expect(
      screen.getAllByRole("link", { name: "kontakt med Nav" }),
    ).toHaveLength(2);
    const cards = screen.getAllByRole("article");
    expect(cards).toHaveLength(2);
    expect(cards[0]).toHaveTextContent("Holmen skole");
    expect(cards[1]).toHaveTextContent("987654321");
  });

  test("does not show unntaksvurderinger when the release toggle is disabled", async () => {
    mockFetch.mockResolvedValue(mockOversiktDataMedUnntaksvurderingerForSM);

    await renderAsync(PlanListeForSykmeldt());

    expect(
      screen.queryByRole("heading", {
        name: "Oppfølgingsplan er foreløpig ikke aktuell",
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
        name: "Oppfølgingsplan er foreløpig ikke aktuell",
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
        name: "Oppfølgingsplan er foreløpig ikke aktuell",
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
