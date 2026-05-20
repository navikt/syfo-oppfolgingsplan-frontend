import { cleanup, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import PlanListeForArbeidsgiver from "@/components/OversiktSide/PlanListe/PlanListeForArbeidsgiver";
import { fetchOppfolgingsplanOversiktForAG } from "@/server/fetchData/arbeidsgiver/fetchOppfolgingsplanOversikt";
import { mockOversiktDataMedPlanerForAG } from "@/server/fetchData/mockData/mockOversiktData";
import {
  mockOversiktDataEmptyWithAccess,
  mockOversiktDataNoEditAccess,
  mockOversiktDataOnlyActivePlan,
  mockOversiktDataOnlyDraft,
  mockOversiktDataOnlyDraftWithoutExpiry,
  mockOversiktDataOnlyPreviousPlans,
} from "@/server/fetchData/mockData/mockOversiktDataVariants";
import { renderAsync } from "@/test/test-utils";

vi.mock("next/navigation", async () => {
  const { mockNextNavigation } = await import(
    "@/test/mocks/nextNavigationMock"
  );

  return mockNextNavigation();
});

const mockFetch = vi.mocked(fetchOppfolgingsplanOversiktForAG);

describe("PlanListeForArbeidsgiver", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  test("calls fetch with correct narmesteLederId", async () => {
    mockFetch.mockResolvedValue({
      error: null,
      data: mockOversiktDataMedPlanerForAG,
    });

    await renderAsync(
      PlanListeForArbeidsgiver({ narmesteLederId: "test-123" }),
    );

    expect(mockFetch).toHaveBeenCalledWith("test-123");
  });

  test("displays error alert when fetch fails", async () => {
    mockFetch.mockResolvedValue({
      error: {
        type: "FETCH_NETWORK_ERROR",
        message: "Network error occurred",
      },
      data: null,
    });

    await renderAsync(PlanListeForArbeidsgiver({ narmesteLederId: "12345" }));

    expect(
      screen.getByText(/Vi fikk ikke kontakt med tjenesten/i),
    ).toBeInTheDocument();
  });

  test("displays organization name in plan cards", async () => {
    mockFetch.mockResolvedValue({
      error: null,
      data: mockOversiktDataMedPlanerForAG,
    });

    await renderAsync(PlanListeForArbeidsgiver({ narmesteLederId: "12345" }));

    // Use getAllByText since organization name appears in multiple cards
    const orgNames = screen.getAllByText("Holmen skole");
    expect(orgNames.length).toBeGreaterThan(0);
  });

  test("displays active plan when present", async () => {
    mockFetch.mockResolvedValue({
      error: null,
      data: mockOversiktDataOnlyActivePlan,
    });

    await renderAsync(PlanListeForArbeidsgiver({ narmesteLederId: "12345" }));

    // Should show organization name for active plan
    expect(screen.getByText("Holmen skole")).toBeInTheDocument();
  });

  test("displays draft section when utkast present", async () => {
    mockFetch.mockResolvedValue({
      error: null,
      data: mockOversiktDataOnlyDraft,
    });

    await renderAsync(PlanListeForArbeidsgiver({ narmesteLederId: "12345" }));

    expect(
      screen.getByRole("heading", { name: /Oppfølgingsplan under arbeid/i }),
    ).toBeInTheDocument();
  });

  test("displays previous plans section when tidligerePlaner present", async () => {
    mockFetch.mockResolvedValue({
      error: null,
      data: mockOversiktDataMedPlanerForAG,
    });

    await renderAsync(PlanListeForArbeidsgiver({ narmesteLederId: "12345" }));

    expect(
      screen.getByRole("heading", { name: /Tidligere oppfølgingsplaner/i }),
    ).toBeInTheDocument();
  });

  test("renders empty section when all plan types are null", async () => {
    mockFetch.mockResolvedValue({
      error: null,
      data: mockOversiktDataEmptyWithAccess,
    });

    await renderAsync(PlanListeForArbeidsgiver({ narmesteLederId: "12345" }));

    // Section should render but be empty (no plan headings or cards)
    expect(screen.queryByText(/Holmen skole/i)).not.toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { name: /Oppfølgingsplan under arbeid/i }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("heading", {
        name: /Tidligere oppfølgingsplaner/i,
      }),
    ).not.toBeInTheDocument();
  });

  test("displays all plan types when all present", async () => {
    mockFetch.mockResolvedValue({
      error: null,
      data: mockOversiktDataMedPlanerForAG,
    });

    await renderAsync(PlanListeForArbeidsgiver({ narmesteLederId: "12345" }));

    // Active plan (organization name appears in card)
    const orgNames = screen.getAllByText("Holmen skole");
    expect(orgNames.length).toBeGreaterThan(0);

    // Draft section
    expect(
      screen.getByRole("heading", { name: /Oppfølgingsplan under arbeid/i }),
    ).toBeInTheDocument();

    // Previous plans section
    expect(
      screen.getByRole("heading", { name: /Tidligere oppfølgingsplaner/i }),
    ).toBeInTheDocument();
  });

  test("displays only previous plans when only tidligerePlaner present", async () => {
    mockFetch.mockResolvedValue({
      error: null,
      data: mockOversiktDataOnlyPreviousPlans,
    });

    await renderAsync(PlanListeForArbeidsgiver({ narmesteLederId: "12345" }));

    // Previous plans section should be present
    expect(
      screen.getByRole("heading", { name: /Tidligere oppfølgingsplaner/i }),
    ).toBeInTheDocument();

    // Active plan and draft should not be present
    expect(
      screen.queryByRole("heading", { name: /Oppfølgingsplan under arbeid/i }),
    ).not.toBeInTheDocument();
  });

  test("renders correctly when user has no edit access", async () => {
    mockFetch.mockResolvedValue({
      error: null,
      data: mockOversiktDataNoEditAccess,
    });

    await renderAsync(PlanListeForArbeidsgiver({ narmesteLederId: "12345" }));

    // Should still display plans even without edit access
    const orgNames = screen.getAllByText("Holmen skole");
    expect(orgNames.length).toBeGreaterThan(0);
  });

  test("displays concrete expiry date when utkastUtloperDato is present", async () => {
    mockFetch.mockResolvedValue({
      error: null,
      data: mockOversiktDataOnlyDraft,
    });

    await renderAsync(PlanListeForArbeidsgiver({ narmesteLederId: "12345" }));

    // mockOversiktDataOnlyDraft has utkastUtloperDato: "2026-02-28T10:17:31Z"
    // getFormattedDateString formats this as "28. februar" (year hidden when same as current year)
    // or "28. februar 2026" (year shown when different from current year)
    expect(
      screen.getByText(
        /^Utkastet slettes 28\. februar( 2026)? hvis dere ikke gjør endringer innen da\.$/,
      ),
    ).toBeInTheDocument();
    expect(
      screen.queryByText(
        /Utkastet slettes automatisk 4 måneder etter siste lagring\./,
      ),
    ).not.toBeInTheDocument();
  });

  test("displays fallback expiry text when utkastUtloperDato is missing", async () => {
    mockFetch.mockResolvedValue({
      error: null,
      data: mockOversiktDataOnlyDraftWithoutExpiry,
    });

    await renderAsync(PlanListeForArbeidsgiver({ narmesteLederId: "12345" }));

    expect(
      screen.getByText(
        "Utkastet slettes automatisk 4 måneder etter siste lagring.",
      ),
    ).toBeInTheDocument();
  });

  test("does not display old 4-month/friskmeldt text for previous plans", async () => {
    mockFetch.mockResolvedValue({
      error: null,
      data: mockOversiktDataMedPlanerForAG,
    });

    await renderAsync(PlanListeForArbeidsgiver({ narmesteLederId: "12345" }));

    expect(
      screen.queryByText(
        /Tidligere planer er tilgjengelige i 4 måneder etter at den ansatte er friskmeldt/,
      ),
    ).not.toBeInTheDocument();
  });

  test("displays new 6-month AG text for previous plans section", async () => {
    mockFetch.mockResolvedValue({
      error: null,
      data: mockOversiktDataMedPlanerForAG,
    });

    await renderAsync(PlanListeForArbeidsgiver({ narmesteLederId: "12345" }));

    expect(
      screen.getByText(
        /Aktive og tidligere oppfølgingsplaner blir utilgjengelige når den ansatte ikke har hatt sykmelding hos dere på 6 måneder/,
      ),
    ).toBeInTheDocument();
  });

  test("displays 6-month AG text when only active plan exists (no previous plans)", async () => {
    mockFetch.mockResolvedValue({
      error: null,
      data: mockOversiktDataOnlyActivePlan,
    });

    await renderAsync(PlanListeForArbeidsgiver({ narmesteLederId: "12345" }));

    expect(
      screen.getByText(
        /Aktive og tidligere oppfølgingsplaner blir utilgjengelige når den ansatte ikke har hatt sykmelding hos dere på 6 måneder/,
      ),
    ).toBeInTheDocument();
  });

  test("displays 6-month AG text exactly once when both active and previous plans exist", async () => {
    mockFetch.mockResolvedValue({
      error: null,
      data: mockOversiktDataMedPlanerForAG,
    });

    await renderAsync(PlanListeForArbeidsgiver({ narmesteLederId: "12345" }));

    const matches = screen.getAllByText(
      /Aktive og tidligere oppfølgingsplaner blir utilgjengelige når den ansatte ikke har hatt sykmelding hos dere på 6 måneder/,
    );
    expect(matches).toHaveLength(1);
  });

  test("does not display 6-month AG text when no plans exist", async () => {
    mockFetch.mockResolvedValue({
      error: null,
      data: mockOversiktDataEmptyWithAccess,
    });

    await renderAsync(PlanListeForArbeidsgiver({ narmesteLederId: "12345" }));

    expect(
      screen.queryByText(/oppfølgingsplaner blir utilgjengelige/),
    ).not.toBeInTheDocument();
  });

  test("does not display old section-level utkast expiry text", async () => {
    mockFetch.mockResolvedValue({
      error: null,
      data: mockOversiktDataOnlyDraft,
    });

    await renderAsync(PlanListeForArbeidsgiver({ narmesteLederId: "12345" }));

    expect(
      screen.queryByText(
        /Oppfølgingsplan under arbeid slettes 4 måneder etter siste lagring/,
      ),
    ).not.toBeInTheDocument();
  });

  test("does not display fullført-plan availability text when only draft exists", async () => {
    mockFetch.mockResolvedValue({
      error: null,
      data: mockOversiktDataOnlyDraft,
    });

    await renderAsync(PlanListeForArbeidsgiver({ narmesteLederId: "12345" }));

    expect(
      screen.queryByText(/oppfølgingsplaner blir utilgjengelige/),
    ).not.toBeInTheDocument();
  });
});
