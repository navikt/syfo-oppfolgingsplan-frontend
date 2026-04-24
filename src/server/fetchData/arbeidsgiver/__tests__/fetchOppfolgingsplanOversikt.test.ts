import { describe, expect, test, vi } from "vitest";
import type { DemoScenario } from "@/common/demoScenario";
import {
  mockOversiktDataMedPlanerForAG,
  mockOversiktDataTom,
} from "@/server/fetchData/mockData/mockOversiktData";
import { mockOversiktDataAktivOgTidligere } from "@/server/fetchData/mockData/mockOversiktDataVariants";

// Remove global mock from vitest-setup.ts so we can test the actual implementation
vi.unmock("@/server/fetchData/arbeidsgiver/fetchOppfolgingsplanOversikt");

import { getMockDataForScenario } from "@/server/fetchData/arbeidsgiver/fetchOppfolgingsplanOversikt";

describe("getMockDataForScenario", () => {
  test("returns empty oversikt for the 'tom' scenario", () => {
    const result = getMockDataForScenario("tom");

    expect(result).toEqual(mockOversiktDataTom);
    expect(result.oversikt.aktivPlan).toBeNull();
    expect(result.oversikt.utkast).toBeNull();
    expect(result.oversikt.tidligerePlaner).toEqual([]);
  });

  test("returns active plan and previous plans for 'aktiv-og-tidligere'", () => {
    const result = getMockDataForScenario("aktiv-og-tidligere");

    expect(result).toEqual(mockOversiktDataAktivOgTidligere);
    expect(result.oversikt.aktivPlan).not.toBeNull();
    expect(result.oversikt.utkast).toBeNull();
    expect(result.oversikt.tidligerePlaner.length).toBeGreaterThan(0);
  });

  test("returns active plan, draft and previous plans for 'aktiv-utkast-og-tidligere'", () => {
    const result = getMockDataForScenario("aktiv-utkast-og-tidligere");

    expect(result).toEqual(mockOversiktDataMedPlanerForAG);
    expect(result.oversikt.aktivPlan).not.toBeNull();
    expect(result.oversikt.utkast).not.toBeNull();
    expect(result.oversikt.tidligerePlaner.length).toBeGreaterThan(0);
  });

  test("throws error for unknown scenario", () => {
    expect(() => getMockDataForScenario("ukjent" as DemoScenario)).toThrow(
      "Unknown demo scenario",
    );
  });
});
