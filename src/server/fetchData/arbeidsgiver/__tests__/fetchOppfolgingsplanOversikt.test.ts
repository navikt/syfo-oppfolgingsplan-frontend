import { describe, expect, test, vi } from "vitest";
import type { DemoScenario } from "@/common/demoScenario";
import {
  mockOversiktDataMedPlanerForAG,
  mockOversiktDataTom,
} from "@/server/fetchData/mockData/mockOversiktData";
import { mockOversiktDataAktivOgTidligere } from "@/server/fetchData/mockData/mockOversiktDataVariants";

// Opphev global mock fra vitest-setup.ts slik at vi kan teste den faktiske implementasjonen
vi.unmock("@/server/fetchData/arbeidsgiver/fetchOppfolgingsplanOversikt");

import { getMockDataForScenario } from "@/server/fetchData/arbeidsgiver/fetchOppfolgingsplanOversikt";

describe("getMockDataForScenario", () => {
  test("returnerer tom oversikt for 'tom'-scenarioet", () => {
    const result = getMockDataForScenario("tom");

    expect(result).toEqual(mockOversiktDataTom);
    expect(result.oversikt.aktivPlan).toBeNull();
    expect(result.oversikt.utkast).toBeNull();
    expect(result.oversikt.tidligerePlaner).toEqual([]);
  });

  test("returnerer aktiv plan og tidligere planer for 'aktiv-og-tidligere'", () => {
    const result = getMockDataForScenario("aktiv-og-tidligere");

    expect(result).toEqual(mockOversiktDataAktivOgTidligere);
    expect(result.oversikt.aktivPlan).not.toBeNull();
    expect(result.oversikt.utkast).toBeNull();
    expect(result.oversikt.tidligerePlaner.length).toBeGreaterThan(0);
  });

  test("returnerer aktiv plan, utkast og tidligere planer for 'aktiv-utkast-og-tidligere'", () => {
    const result = getMockDataForScenario("aktiv-utkast-og-tidligere");

    expect(result).toEqual(mockOversiktDataMedPlanerForAG);
    expect(result.oversikt.aktivPlan).not.toBeNull();
    expect(result.oversikt.utkast).not.toBeNull();
    expect(result.oversikt.tidligerePlaner.length).toBeGreaterThan(0);
  });

  test("kaster feil for ukjent scenario", () => {
    expect(() => getMockDataForScenario("ukjent" as DemoScenario)).toThrow(
      "Unknown demo scenario",
    );
  });
});
