import { describe, expect, it } from "vitest";
import {
  DEFAULT_DEMO_SCENARIO,
  parseDemoScenario,
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
