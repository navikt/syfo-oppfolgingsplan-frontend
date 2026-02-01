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
  mockOversiktDataOnlyPreviousPlans,
} from "@/server/fetchData/mockData/mockOversiktDataVariants";
import { renderAsync } from "@/test/test-utils";

vi.mock("next/navigation", () => ({
  useParams: () => ({ narmesteLederId: "12345" }),
  useRouter: () => ({ push: vi.fn(), refresh: vi.fn() }),
}));

vi.mock("@/server/fetchData/arbeidsgiver/fetchOppfolgingsplanOversikt");

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
});
