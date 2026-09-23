import { afterEach, describe, expect, test, vi } from "vitest";
import {
  DEMO_SCENARIO_COOKIE,
  DEMO_TILTAKSPAKKE_VARIANT_COOKIE,
  type DemoScenario,
} from "@/common/demoScenario";
import {
  mockOversiktDataMedPlanerForAG,
  mockOversiktDataTom,
} from "@/server/fetchData/mockData/mockOversiktData";
import { mockOversiktDataAktivOgTidligere } from "@/server/fetchData/mockData/mockOversiktDataVariants";

// Remove global mock from vitest-setup.ts so we can test the actual implementation
vi.unmock("@/server/fetchData/arbeidsgiver/fetchOppfolgingsplanOversikt");

import { getMockDataForScenario } from "@/server/fetchData/arbeidsgiver/fetchOppfolgingsplanOversikt";

async function importFetcher({
  demoScenario,
  demoTiltakspakkeVariant,
}: {
  demoScenario?: string;
  demoTiltakspakkeVariant?: string;
}) {
  vi.resetModules();
  vi.doMock("@/env-variables/envHelpers", async () => {
    const actual = await vi.importActual<
      typeof import("@/env-variables/envHelpers")
    >("@/env-variables/envHelpers");

    return {
      ...actual,
      isLocalOrDemo: true,
    };
  });
  vi.doMock("next/headers", () => ({
    cookies: async () => ({
      get: (name: string) => {
        if (name === DEMO_SCENARIO_COOKIE && demoScenario !== undefined) {
          return { value: demoScenario };
        }

        if (
          name === DEMO_TILTAKSPAKKE_VARIANT_COOKIE &&
          demoTiltakspakkeVariant !== undefined
        ) {
          return { value: demoTiltakspakkeVariant };
        }

        return undefined;
      },
    }),
  }));
  vi.doMock("@/server/fetchData/mockData/simulateBackendDelay", () => ({
    simulateBackendDelay: vi.fn(),
  }));

  return await import("../fetchOppfolgingsplanOversikt");
}

describe("getMockDataForScenario", () => {
  afterEach(() => {
    vi.resetModules();
    vi.doUnmock("@/env-variables/envHelpers");
    vi.doUnmock("next/headers");
    vi.doUnmock("@/server/fetchData/mockData/simulateBackendDelay");
  });

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

  test("returns unntak meldt uten planer for 'unntak-meldt'", () => {
    const result = getMockDataForScenario("unntak-meldt");

    expect(result.oversikt.aktivPlan).toBeNull();
    expect(result.oversikt.utkast).toBeNull();
    expect(result.oversikt.tidligerePlaner).toEqual([]);
    expect(result.oversikt.unntaksvurderinger.length).toBeGreaterThan(0);
    expect(result.oversikt.gjeldendeStatus).toBe("IKKE_AKTUELT");
  });

  test("throws error for unknown scenario", () => {
    expect(() => getMockDataForScenario("ukjent" as DemoScenario)).toThrow(
      "Unknown demo scenario",
    );
  });

  test("uses the default data when a persisted Standard variant has unntak-meldt", async () => {
    const { fetchOppfolgingsplanOversiktForAG } = await importFetcher({
      demoScenario: "unntak-meldt",
      demoTiltakspakkeVariant: "standard",
    });

    const result = await fetchOppfolgingsplanOversiktForAG("narmeste-leder-id");

    expect(result).toEqual({
      error: null,
      data: mockOversiktDataAktivOgTidligere,
    });
  });
});
