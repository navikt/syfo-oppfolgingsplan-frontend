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
import { mockOversiktDataAktivOgTidligere } from "../mockData/mockOversiktDataVariants";
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
    default: {
      const _exhaustive: never = scenario;
      throw new Error(`Unknown demo scenario: ${_exhaustive}`);
    }
  }
}

export async function fetchOppfolgingsplanOversiktForAG(
  narmesteLederId: string,
): Promise<FetchGetResult<OppfolgingsplanerOversiktForAG>> {
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
}
