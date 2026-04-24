import {
  DEMO_SCENARIO_COOKIE,
  type DemoScenario,
  parseDemoScenario,
} from "@/common/demoScenario";
import { isLocalOrDemo } from "@/env-variables/envHelpers";
import { getServerEnv } from "@/env-variables/serverEnv";
import {
  type OppfolgingsplanerOversiktForSM,
  OppfolgingsplanerOversiktResponseSchemaForSM,
} from "@/schema/oversiktResponseSchemas";
import { getRedirectAfterLoginUrlForSM } from "@/server/auth/redirectToLogin";
import { TokenXTargetApi } from "@/server/auth/tokenXExchange";
import { tokenXFetchGet } from "@/server/tokenXFetch/tokenXFetchGet";
import {
  mockOversiktDataMedPlanerForSM,
  mockOversiktDataTomForSM,
} from "../mockData/mockOversiktData";
import { simulateBackendDelay } from "../mockData/simulateBackendDelay";

/** @visibleForTesting */
export function getMockDataForScenarioSM(scenario: DemoScenario) {
  switch (scenario) {
    case "tom":
      return mockOversiktDataTomForSM;
    case "aktiv-og-tidligere":
    case "aktiv-utkast-og-tidligere":
      return mockOversiktDataMedPlanerForSM;
    default: {
      const _exhaustive: never = scenario;
      throw new Error(`Unknown demo scenario: ${_exhaustive}`);
    }
  }
}

export async function fetchOppfolgingsplanOversiktForSM(): Promise<OppfolgingsplanerOversiktForSM> {
  if (isLocalOrDemo) {
    const { cookies } = await import("next/headers");
    const scenario = parseDemoScenario(
      (await cookies()).get(DEMO_SCENARIO_COOKIE)?.value,
    );
    await simulateBackendDelay();
    return getMockDataForScenarioSM(scenario);
  }

  return await tokenXFetchGet({
    targetApi: TokenXTargetApi.SYFO_OPPFOLGINGSPLAN_BACKEND,
    endpoint: `${getServerEnv().SYFO_OPPFOLGINGSPLAN_BACKEND_HOST}/api/v1/sykmeldt/oppfolgingsplaner/oversikt`,
    responseDataSchema: OppfolgingsplanerOversiktResponseSchemaForSM,
    redirectAfterLoginUrl: getRedirectAfterLoginUrlForSM(),
  });
}
