import { cache } from "react";
import { getEndpointOversiktForAG } from "@/common/backend-endpoints";
import {
  DEMO_SCENARIO_COOKIE,
  type DemoScenario,
  parseDemoScenario,
} from "@/common/demoScenario";
import { isLocalOrDemo } from "@/env-variables/envHelpers";
import {
  type OppfolgingsplanerOversiktForAG,
  OppfolgingsplanerOversiktResponseSchemaForAG,
} from "@/schema/oversiktResponseSchemas";
import { getRedirectAfterLoginUrlForAG } from "@/server/auth/redirectToLogin";
import { TokenXTargetApi } from "@/server/auth/tokenXExchange";
import type { FetchGetResult } from "@/server/tokenXFetch/FetchResult";
import { tokenXFetchGetWithResult } from "@/server/tokenXFetch/tokenXFetchGetWithResult";
import {
  mockOversiktDataMedPlanerForAG,
  mockOversiktDataTom,
} from "../mockData/mockOversiktData";
import {
  mockOversiktDataAktivOgTidligere,
  mockOversiktDataMedUnntak,
} from "../mockData/mockOversiktDataVariants";
import { simulateBackendDelay } from "../mockData/simulateBackendDelay";

/** @visibleForTesting */
export function getMockDataForScenario(scenario: DemoScenario) {
  switch (scenario) {
    case "tom":
      return mockOversiktDataTom;
    case "aktiv-og-tidligere":
      return mockOversiktDataAktivOgTidligere;
    case "aktiv-utkast-og-tidligere":
      return mockOversiktDataMedPlanerForAG;
    case "unntak-meldt":
      return mockOversiktDataMedUnntak;
    default: {
      const _exhaustive: never = scenario;
      throw new Error(`Unknown demo scenario: ${_exhaustive}`);
    }
  }
}

/**
 * Cached with React cache() so all server components that need the oversikt in
 * the same render pass share one backend call. Next.js' own fetch memoization
 * does not dedupe these requests: the cache key includes all request headers,
 * and getBackendRequestHeaders() sets a fresh nanoid() in Nav-Call-Id per call.
 */
export const fetchOppfolgingsplanOversiktForAG = cache(
  async (
    narmesteLederId: string,
  ): Promise<FetchGetResult<OppfolgingsplanerOversiktForAG>> => {
    if (isLocalOrDemo) {
      const { cookies } = await import("next/headers");
      const scenario = parseDemoScenario(
        (await cookies()).get(DEMO_SCENARIO_COOKIE)?.value,
      );
      await simulateBackendDelay();

      return {
        error: null,
        data: getMockDataForScenario(scenario),
      };
    }

    return await tokenXFetchGetWithResult({
      targetApi: TokenXTargetApi.SYFO_OPPFOLGINGSPLAN_BACKEND,
      endpoint: getEndpointOversiktForAG(narmesteLederId),
      responseDataSchema: OppfolgingsplanerOversiktResponseSchemaForAG,
      redirectAfterLoginUrl: getRedirectAfterLoginUrlForAG(narmesteLederId),
    });
  },
);
