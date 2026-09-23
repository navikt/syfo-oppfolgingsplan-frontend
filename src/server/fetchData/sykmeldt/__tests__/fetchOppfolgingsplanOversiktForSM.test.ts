import { afterEach, describe, expect, test, vi } from "vitest";
import {
  DEMO_SCENARIO_COOKIE,
  DEMO_TILTAKSPAKKE_VARIANT_COOKIE,
  type DemoScenario,
} from "@/common/demoScenario";
import {
  mockOversiktDataMedPlanerForSM,
  mockOversiktDataMedUnntaksvurderingerForSM,
  mockOversiktDataTomForSM,
} from "@/server/fetchData/mockData/mockOversiktData";
import { getMockDataForScenarioSM } from "@/server/fetchData/sykmeldt/fetchOppfolgingsplanOversiktForSM";

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

  return await import("../fetchOppfolgingsplanOversiktForSM");
}

describe("getMockDataForScenarioSM", () => {
  afterEach(() => {
    vi.resetModules();
    vi.doUnmock("@/env-variables/envHelpers");
    vi.doUnmock("next/headers");
    vi.doUnmock("@/server/fetchData/mockData/simulateBackendDelay");
  });

  test("returns empty oversikt for the 'tom' scenario", () => {
    const result = getMockDataForScenarioSM("tom");

    expect(result).toEqual(mockOversiktDataTomForSM);
    expect(result.virksomheter).toHaveLength(1);
    expect(result.virksomheter[0]?.oppfolgingsplanhendelser).toEqual([]);
  });

  test("returns plans for 'aktiv-og-tidligere'", () => {
    const result = getMockDataForScenarioSM("aktiv-og-tidligere");

    expect(result).toEqual(mockOversiktDataMedPlanerForSM);
    expect(result.virksomheter.length).toBeGreaterThan(0);
    expect(
      result.virksomheter[0]?.oppfolgingsplanhendelser.length,
    ).toBeGreaterThan(1);
  });

  test("returns plan events for the 'unntak-meldt' scenario", () => {
    const result = getMockDataForScenarioSM("unntak-meldt");

    expect(result).toEqual(mockOversiktDataMedUnntaksvurderingerForSM);
    expect(
      result.virksomheter.some(({ oppfolgingsplanhendelser }) =>
        oppfolgingsplanhendelser.some(
          (hendelse) => hendelse.type === "PLAN_IKKE_NODVENDIG",
        ),
      ),
    ).toBe(true);
  });

  test("returns same data for 'aktiv-utkast-og-tidligere' as for 'aktiv-og-tidligere'", () => {
    const resultAktiv = getMockDataForScenarioSM("aktiv-og-tidligere");
    const resultUtkast = getMockDataForScenarioSM("aktiv-utkast-og-tidligere");

    expect(resultUtkast).toEqual(resultAktiv);
    expect(resultUtkast).toEqual(mockOversiktDataMedPlanerForSM);
  });

  test("throws error for unknown scenario", () => {
    expect(() => getMockDataForScenarioSM("ukjent" as DemoScenario)).toThrow(
      "Unknown demo scenario",
    );
  });

  test("uses the default data for a persisted scenario that is unavailable on SM", async () => {
    const { fetchOppfolgingsplanOversiktForSM } = await importFetcher({
      demoScenario: "unntak-meldt",
      demoTiltakspakkeVariant: "tiltakspakke-1",
    });

    const result = await fetchOppfolgingsplanOversiktForSM();

    expect(result).toEqual(mockOversiktDataMedPlanerForSM);
  });
});
