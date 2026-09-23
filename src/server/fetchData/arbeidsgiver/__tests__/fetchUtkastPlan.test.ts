import { afterEach, describe, expect, test, vi } from "vitest";
import {
  DEMO_SCENARIO_COOKIE,
  DEMO_TILTAKSPAKKE_VARIANT_COOKIE,
} from "@/common/demoScenario";

// Remove global mock from vitest-setup.ts so we can test the actual implementation
vi.unmock("@/server/fetchData/arbeidsgiver/fetchUtkastPlan");

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

  return await import("../fetchUtkastPlan");
}

describe("fetchUtkastDataForAG", () => {
  afterEach(() => {
    vi.resetModules();
    vi.doUnmock("@/env-variables/envHelpers");
    vi.doUnmock("next/headers");
    vi.doUnmock("@/server/fetchData/mockData/simulateBackendDelay");
  });

  test("returns an empty draft for the 'tom' scenario", async () => {
    const { fetchUtkastDataForAG } = await importFetcher({
      demoScenario: "tom",
    });
    const { mockTomtUtkastResponse } = await import(
      "@/server/fetchData/mockData/mockUtkastData"
    );

    await expect(fetchUtkastDataForAG("narmeste-leder-id")).resolves.toEqual(
      mockTomtUtkastResponse,
    );
  });

  test("returns the saved draft for the 'aktiv-og-tidligere' scenario", async () => {
    const { fetchUtkastDataForAG } = await importFetcher({
      demoScenario: "aktiv-og-tidligere",
    });
    const { mockUtkastResponse } = await import(
      "@/server/fetchData/mockData/mockUtkastData"
    );

    await expect(fetchUtkastDataForAG("narmeste-leder-id")).resolves.toEqual(
      mockUtkastResponse,
    );
  });

  test("returns the saved draft when the scenario cookie is missing", async () => {
    const { fetchUtkastDataForAG } = await importFetcher({});
    const { mockUtkastResponse } = await import(
      "@/server/fetchData/mockData/mockUtkastData"
    );

    await expect(fetchUtkastDataForAG("narmeste-leder-id")).resolves.toEqual(
      mockUtkastResponse,
    );
  });
});
