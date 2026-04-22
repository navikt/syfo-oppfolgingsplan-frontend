import { describe, expect, it } from "vitest";
import {
  DEFAULT_DEMO_SCENARIO,
  parseDemoScenario,
} from "@/common/demoScenario";

describe("parseDemoScenario", () => {
  it("returnerer riktig scenario for gyldig input 'tom'", () => {
    expect(parseDemoScenario("tom")).toBe("tom");
  });

  it("returnerer riktig scenario for gyldig input 'aktiv-og-tidligere'", () => {
    expect(parseDemoScenario("aktiv-og-tidligere")).toBe("aktiv-og-tidligere");
  });

  it("returnerer riktig scenario for gyldig input 'aktiv-utkast-og-tidligere'", () => {
    expect(parseDemoScenario("aktiv-utkast-og-tidligere")).toBe(
      "aktiv-utkast-og-tidligere",
    );
  });

  it("returnerer DEFAULT_DEMO_SCENARIO for ugyldig string", () => {
    expect(parseDemoScenario("ugyldig-verdi")).toBe(DEFAULT_DEMO_SCENARIO);
  });

  it("returnerer DEFAULT_DEMO_SCENARIO for undefined", () => {
    expect(parseDemoScenario(undefined)).toBe(DEFAULT_DEMO_SCENARIO);
  });

  it("returnerer DEFAULT_DEMO_SCENARIO for array input", () => {
    expect(parseDemoScenario(["tom", "aktiv-og-tidligere"])).toBe(
      DEFAULT_DEMO_SCENARIO,
    );
  });
});
