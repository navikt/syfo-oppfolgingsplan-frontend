import { cleanup, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { erOrgINavTiltaksgruppe } from "@/server/fetchData/arbeidsgiver/erOrgINavTiltaksgruppe";
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

const envMock = vi.hoisted(() => ({
  tiltakspakkevurderingFeatureToggleEnabled: false,
}));

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

const mockFetch = vi.mocked(fetchOppfolgingsplanOversiktForAG);
const mockErOrgINavTiltaksgruppe = vi.mocked(erOrgINavTiltaksgruppe);

describe("NyPlanButtonHvisTomListe", () => {
  beforeEach(() => {
    envMock.tiltakspakkevurderingFeatureToggleEnabled = false;
    vi.clearAllMocks();
    mockErOrgINavTiltaksgruppe.mockResolvedValue(false);
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

    expect(
      screen.queryByRole("button", { name: /Lag en ny oppfølgingsplan/i }),
    ).not.toBeInTheDocument();
  });

  describe("Flaggskipet-gating", () => {
    test("kaller ikke Flaggskipet når listen ikke er tom (aktiv plan)", async () => {
      mockFetch.mockResolvedValue({
        error: null,
        data: mockOversiktDataOnlyActivePlan,
      });

      await renderAsync(NyPlanButtonHvisTomListe({ narmesteLederId: "12345" }));

      expect(mockErOrgINavTiltaksgruppe).not.toHaveBeenCalled();
    });

    test("kaller ikke Flaggskipet når listen ikke er tom (utkast)", async () => {
      mockFetch.mockResolvedValue({
        error: null,
        data: mockOversiktDataOnlyDraft,
      });

      await renderAsync(NyPlanButtonHvisTomListe({ narmesteLederId: "12345" }));

      expect(mockErOrgINavTiltaksgruppe).not.toHaveBeenCalled();
    });

    test("kaller ikke Flaggskipet når listen ikke er tom (tidligere planer)", async () => {
      mockFetch.mockResolvedValue({
        error: null,
        data: mockOversiktDataOnlyPreviousPlans,
      });

      await renderAsync(NyPlanButtonHvisTomListe({ narmesteLederId: "12345" }));

      expect(mockErOrgINavTiltaksgruppe).not.toHaveBeenCalled();
    });

    test("kaller ikke Flaggskipet når bruker mangler edit access", async () => {
      mockFetch.mockResolvedValue({
        error: null,
        data: mockOversiktDataEmptyNoAccess,
      });

      await renderAsync(NyPlanButtonHvisTomListe({ narmesteLederId: "12345" }));

      expect(mockErOrgINavTiltaksgruppe).not.toHaveBeenCalled();
    });

    test("kaller ikke Flaggskipet når toggelen er av selv om listen er tom og bruker har edit access", async () => {
      mockFetch.mockResolvedValue({
        error: null,
        data: mockOversiktDataEmptyWithAccess,
      });

      await renderAsync(NyPlanButtonHvisTomListe({ narmesteLederId: "12345" }));

      expect(mockErOrgINavTiltaksgruppe).not.toHaveBeenCalled();
      expect(
        screen.getByRole("button", { name: /Lag en ny oppfølgingsplan/i }),
      ).toBeInTheDocument();
    });

    test("viser unntaksvalget sammen med hovedvalget når org er i tiltaksgruppen", async () => {
      envMock.tiltakspakkevurderingFeatureToggleEnabled = true;
      mockErOrgINavTiltaksgruppe.mockResolvedValue(true);
      mockFetch.mockResolvedValue({
        error: null,
        data: mockOversiktDataEmptyWithAccess,
      });

      await renderAsync(NyPlanButtonHvisTomListe({ narmesteLederId: "12345" }));

      expect(mockErOrgINavTiltaksgruppe).toHaveBeenCalledWith("123456789");
      expect(
        screen.getByRole("button", { name: /Lag en ny oppfølgingsplan/i }),
      ).toBeInTheDocument();
      expect(
        screen.getByText(/Det finnes noen unntak fra å lage oppfølgingsplan/i),
      ).toBeInTheDocument();
    });

    test("viser ikke unntaksvalget når org ikke er i tiltaksgruppen", async () => {
      envMock.tiltakspakkevurderingFeatureToggleEnabled = true;
      mockErOrgINavTiltaksgruppe.mockResolvedValue(false);
      mockFetch.mockResolvedValue({
        error: null,
        data: mockOversiktDataEmptyWithAccess,
      });

      await renderAsync(NyPlanButtonHvisTomListe({ narmesteLederId: "12345" }));

      expect(mockErOrgINavTiltaksgruppe).toHaveBeenCalledWith("123456789");
      expect(
        screen.getByRole("button", { name: /Lag en ny oppfølgingsplan/i }),
      ).toBeInTheDocument();
      expect(
        screen.queryByText(
          /Det finnes noen unntak fra å lage oppfølgingsplan/i,
        ),
      ).not.toBeInTheDocument();
    });

    test("viser ikke unntaksvalget når toggelen er av", async () => {
      envMock.tiltakspakkevurderingFeatureToggleEnabled = false;
      mockFetch.mockResolvedValue({
        error: null,
        data: mockOversiktDataEmptyWithAccess,
      });

      await renderAsync(NyPlanButtonHvisTomListe({ narmesteLederId: "12345" }));

      expect(
        screen.queryByText(
          /Det finnes noen unntak fra å lage oppfølgingsplan/i,
        ),
      ).not.toBeInTheDocument();
    });
  });
});
