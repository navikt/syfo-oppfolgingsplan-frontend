import { getEndpointOversiktForAG } from "@/common/backend-endpoints";
import {
  DEFAULT_DEMO_SCENARIO,
  type DemoScenario,
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

function getMockDataForScenario(scenario: DemoScenario) {
  switch (scenario) {
    case "tom":
      return mockOversiktDataTom;
    case "aktiv-og-tidligere":
      return mockOversiktDataAktivOgTidligere;
    case "aktiv-utkast-og-tidligere":
      return mockOversiktDataMedPlanerForAG;
    default: {
      const _exhaustive: never = scenario;
      throw new Error(`Ukjent demo-scenario: ${_exhaustive}`);
    }
  }
}

export async function fetchOppfolgingsplanOversiktForAG(
  narmesteLederId: string,
  scenario: DemoScenario = DEFAULT_DEMO_SCENARIO,
): Promise<FetchGetResult<OppfolgingsplanerOversiktForAG>> {
  if (isLocalOrDemo) {
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
