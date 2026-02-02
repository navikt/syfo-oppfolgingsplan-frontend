import { cleanup, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { fetchOppfolgingsplanOversiktForAG } from "@/server/fetchData/arbeidsgiver/fetchOppfolgingsplanOversikt";
import { mockOversiktDataMedPlanerForAG } from "@/server/fetchData/mockData/mockOversiktData";
import {
  mockOversiktDataEmptyNoAccess,
  mockOversiktDataEmptyWithAccess,
  mockOversiktDataOnlyActivePlan,
  mockOversiktDataOnlyDraft,
  mockOversiktDataOnlyPreviousPlans,
} from "@/server/fetchData/mockData/mockOversiktDataVariants";
import { renderAsync } from "@/test/test-utils";
import NyPlanButtonHvisTomListe from "../NyPlanButtonHvisTomListe";

// Mock the fetch function
vi.mock("@/server/fetchData/arbeidsgiver/fetchOppfolgingsplanOversikt");

// Mock Next.js navigation (needed by LagNyOppfolgingsplanButton)
vi.mock("next/navigation", () => ({
  useParams: () => ({ narmesteLederId: "12345" }),
  useRouter: () => ({ push: vi.fn(), refresh: vi.fn() }),
}));

const mockFetch = vi.mocked(fetchOppfolgingsplanOversiktForAG);

describe("NyPlanButtonHvisTomListe", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  test("calls fetch with correct narmesteLederId", async () => {
    mockFetch.mockResolvedValue({
      error: null,
      data: mockOversiktDataEmptyWithAccess,
    });

    await renderAsync(
      NyPlanButtonHvisTomListe({ narmesteLederId: "test-123" }),
    );

    expect(mockFetch).toHaveBeenCalledWith("test-123");
  });

  test("shows button when list is empty and user has edit access", async () => {
    mockFetch.mockResolvedValue({
      error: null,
      data: mockOversiktDataEmptyWithAccess,
    });

    await renderAsync(NyPlanButtonHvisTomListe({ narmesteLederId: "12345" }));

    expect(
      screen.getByRole("button", { name: /Lag en ny oppfølgingsplan/i }),
    ).toBeInTheDocument();
  });

  test("does not show button when user has active plan", async () => {
    mockFetch.mockResolvedValue({
      error: null,
      data: mockOversiktDataOnlyActivePlan,
    });

    await renderAsync(NyPlanButtonHvisTomListe({ narmesteLederId: "12345" }));

    expect(
      screen.queryByRole("button", { name: /Lag en ny oppfølgingsplan/i }),
    ).not.toBeInTheDocument();
  });

  test("does not show button when user has draft", async () => {
    mockFetch.mockResolvedValue({
      error: null,
      data: mockOversiktDataOnlyDraft,
    });

    await renderAsync(NyPlanButtonHvisTomListe({ narmesteLederId: "12345" }));

    expect(
      screen.queryByRole("button", { name: /Lag en ny oppfølgingsplan/i }),
    ).not.toBeInTheDocument();
  });

  test("does not show button when user has previous plans only", async () => {
    mockFetch.mockResolvedValue({
      error: null,
      data: mockOversiktDataOnlyPreviousPlans,
    });

    await renderAsync(NyPlanButtonHvisTomListe({ narmesteLederId: "12345" }));

    expect(
      screen.queryByRole("button", { name: /Lag en ny oppfølgingsplan/i }),
    ).not.toBeInTheDocument();
  });

  test("does not show button when list is empty but user has no edit access", async () => {
    mockFetch.mockResolvedValue({
      error: null,
      data: mockOversiktDataEmptyNoAccess,
    });

    await renderAsync(NyPlanButtonHvisTomListe({ narmesteLederId: "12345" }));

    expect(
      screen.queryByRole("button", { name: /Lag en ny oppfølgingsplan/i }),
    ).not.toBeInTheDocument();
  });

  test("does not show button when has all plan types", async () => {
    mockFetch.mockResolvedValue({
      error: null,
      data: mockOversiktDataMedPlanerForAG,
    });

    await renderAsync(NyPlanButtonHvisTomListe({ narmesteLederId: "12345" }));

    expect(
      screen.queryByRole("button", { name: /Lag en ny oppfølgingsplan/i }),
    ).not.toBeInTheDocument();
  });

  test("returns null when fetch fails", async () => {
    mockFetch.mockResolvedValue({
      error: {
        type: "FETCH_NETWORK_ERROR",
        message: "Network error",
      },
      data: null,
    });

    await renderAsync(NyPlanButtonHvisTomListe({ narmesteLederId: "12345" }));

    // Component returns null, button should not be present
    expect(
      screen.queryByRole("button", { name: /Lag en ny oppfølgingsplan/i }),
    ).not.toBeInTheDocument();
  });
});
