import { describe, expect, it } from "vitest";
import {
  AG_SCENARIO_OPTIONS,
  DEFAULT_DEMO_SCENARIO,
  DEFAULT_DEMO_TILTAKSPAKKE_VARIANT,
  getAvailableDemoScenarioOptions,
  parseDemoScenario,
  parseDemoTiltakspakkeVariant,
} from "@/common/demoScenario";

describe("parseDemoScenario", () => {
  it("returns correct scenario for valid input 'tom'", () => {
    expect(parseDemoScenario("tom")).toBe("tom");
  });

  it("returns correct scenario for valid input 'aktiv-og-tidligere'", () => {
    expect(parseDemoScenario("aktiv-og-tidligere")).toBe("aktiv-og-tidligere");
  });

  it("returns correct scenario for valid input 'aktiv-utkast-og-tidligere'", () => {
    expect(parseDemoScenario("aktiv-utkast-og-tidligere")).toBe(
      "aktiv-utkast-og-tidligere",
    );
  });

  it("returns DEFAULT_DEMO_SCENARIO for invalid string", () => {
    expect(parseDemoScenario("ugyldig-verdi")).toBe(DEFAULT_DEMO_SCENARIO);
  });

  it("returns DEFAULT_DEMO_SCENARIO for undefined", () => {
    expect(parseDemoScenario(undefined)).toBe(DEFAULT_DEMO_SCENARIO);
  });

  it("returns DEFAULT_DEMO_SCENARIO for array input", () => {
    expect(parseDemoScenario(["tom", "aktiv-og-tidligere"])).toBe(
      DEFAULT_DEMO_SCENARIO,
    );
  });
});

describe("parseDemoTiltakspakkeVariant", () => {
  it("returns standard for valid input", () => {
    expect(parseDemoTiltakspakkeVariant("standard")).toBe("standard");
  });

  it("returns tiltakspakke-1 for valid input", () => {
    expect(parseDemoTiltakspakkeVariant("tiltakspakke-1")).toBe(
      "tiltakspakke-1",
    );
  });

  it("returns Standard for invalid, missing, and array input", () => {
    expect(parseDemoTiltakspakkeVariant("ugyldig-verdi")).toBe(
      DEFAULT_DEMO_TILTAKSPAKKE_VARIANT,
    );
    expect(parseDemoTiltakspakkeVariant(undefined)).toBe(
      DEFAULT_DEMO_TILTAKSPAKKE_VARIANT,
    );
    expect(parseDemoTiltakspakkeVariant(["standard", "tiltakspakke-1"])).toBe(
      DEFAULT_DEMO_TILTAKSPAKKE_VARIANT,
    );
  });
});

describe("getAvailableDemoScenarioOptions", () => {
  it("hides unntak-meldt for Standard while preserving the other AG scenarios", () => {
    expect(
      getAvailableDemoScenarioOptions(AG_SCENARIO_OPTIONS, "standard").map(
        ({ value }) => value,
      ),
    ).toEqual(["tom", "aktiv-og-tidligere", "aktiv-utkast-og-tidligere"]);
  });

  it("includes unntak-meldt for Tiltakspakke 1", () => {
    expect(
      getAvailableDemoScenarioOptions(
        AG_SCENARIO_OPTIONS,
        "tiltakspakke-1",
      ).map(({ value }) => value),
    ).toContain("unntak-meldt");
  });
});
