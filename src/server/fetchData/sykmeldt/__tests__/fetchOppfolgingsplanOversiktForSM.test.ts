import { describe, expect, test } from "vitest";
import type { DemoScenario } from "@/common/demoScenario";
import {
  mockOversiktDataMedPlanerForSM,
  mockOversiktDataTomForSM,
} from "@/server/fetchData/mockData/mockOversiktData";
import { getMockDataForScenarioSM } from "../fetchOppfolgingsplanOversiktForSM";

describe("getMockDataForScenarioSM", () => {
  test("returnerer tom oversikt for 'tom'-scenarioet", () => {
    const result = getMockDataForScenarioSM("tom");

    expect(result).toEqual(mockOversiktDataTomForSM);
    expect(result.aktiveOppfolgingsplaner).toEqual([]);
    expect(result.tidligerePlaner).toEqual([]);
  });

  test("returnerer planer for 'aktiv-og-tidligere'", () => {
    const result = getMockDataForScenarioSM("aktiv-og-tidligere");

    expect(result).toEqual(mockOversiktDataMedPlanerForSM);
    expect(result.aktiveOppfolgingsplaner.length).toBeGreaterThan(0);
    expect(result.tidligerePlaner.length).toBeGreaterThan(0);
  });

  test("returnerer same data for 'aktiv-utkast-og-tidligere' som for 'aktiv-og-tidligere'", () => {
    const resultAktiv = getMockDataForScenarioSM("aktiv-og-tidligere");
    const resultUtkast = getMockDataForScenarioSM("aktiv-utkast-og-tidligere");

    expect(resultUtkast).toEqual(resultAktiv);
    expect(resultUtkast).toEqual(mockOversiktDataMedPlanerForSM);
  });

  test("kaster feil for ukjent scenario", () => {
    expect(() => getMockDataForScenarioSM("ukjent" as DemoScenario)).toThrow(
      "Unknown demo scenario",
    );
  });
});
