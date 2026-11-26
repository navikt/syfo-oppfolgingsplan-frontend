import { describe, expect, it } from "vitest";
import {
  AG_SCENARIO_OPTIONS,
  DEFAULT_DEMO_SCENARIO,
  DEFAULT_DEMO_TILTAKSPAKKE_VARIANT,
  parseDemoScenario,
  parseDemoTiltakspakkeVariant,
  resolveDemoScenario,
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

  it("returns tiltakspakke-2 for valid input", () => {
    expect(parseDemoTiltakspakkeVariant("tiltakspakke-2")).toBe(
      "tiltakspakke-2",
    );
  });

  it("returns Standard for invalid, missing, and array input", () => {
    expect(parseDemoTiltakspakkeVariant("ugyldig-verdi")).toBe(
      DEFAULT_DEMO_TILTAKSPAKKE_VARIANT,
    );
    expect(parseDemoTiltakspakkeVariant(undefined)).toBe(
      DEFAULT_DEMO_TILTAKSPAKKE_VARIANT,
    );
    expect(parseDemoTiltakspakkeVariant(["standard", "tiltakspakke-2"])).toBe(
      DEFAULT_DEMO_TILTAKSPAKKE_VARIANT,
    );
  });
});

describe("resolveDemoScenario", () => {
  it("keeps unntak-meldt for arbeidsgiver", () => {
    expect(resolveDemoScenario(AG_SCENARIO_OPTIONS, "unntak-meldt")).toBe(
      "unntak-meldt",
    );
  });

  it("falls back to the default scenario when the scenario is unavailable", () => {
    expect(
      resolveDemoScenario(
        [
          { value: "tom", label: "Tom" },
          {
            value: "aktiv-og-tidligere",
            label: "Aktiv plan + tidligere planer",
          },
        ],
        "unntak-meldt",
      ),
    ).toBe(DEFAULT_DEMO_SCENARIO);
  });

  it("falls back to the first available scenario when the default is unavailable", () => {
    expect(
      resolveDemoScenario(
        [{ value: "tom", label: "Tom" }],
        "aktiv-og-tidligere",
      ),
    ).toBe("tom");
  });
});
