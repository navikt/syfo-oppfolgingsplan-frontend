import { getEndpointUtkastForAG } from "@/common/backend-endpoints";
import {
  AG_SCENARIO_OPTIONS,
  DEMO_SCENARIO_COOKIE,
  DEMO_TILTAKSPAKKE_VARIANT_COOKIE,
  parseDemoScenario,
  parseDemoTiltakspakkeVariant,
  resolveDemoScenario,
} from "@/common/demoScenario";
import { RuntimeErrorEvent } from "@/common/runtimeErrorEvent";
import { isLocalOrDemo } from "@/env-variables/envHelpers";
import {
  type ConvertedLagretUtkastResponse,
  rawUtkastResponseForAGSchema,
} from "@/schema/utkastResponseSchema";
import { getRedirectAfterLoginUrlForAG } from "@/server/auth/redirectToLogin";
import { TokenXTargetApi } from "@/server/auth/tokenXExchange";
import { tokenXFetchGet } from "@/server/tokenXFetch/tokenXFetchGet";
import { convertPlanContentToCurrentSchema } from "@/utils/convertPlanContentToCurrentSchema";
import {
  mockTomtUtkastResponse,
  mockUtkastResponse,
} from "../mockData/mockUtkastData";
import { simulateBackendDelay } from "../mockData/simulateBackendDelay";

export async function fetchUtkastDataForAG(
  narmesteLederId: string,
): Promise<ConvertedLagretUtkastResponse> {
  if (isLocalOrDemo) {
    const { cookies } = await import("next/headers");
    const cookieStore = await cookies();
    const variant = parseDemoTiltakspakkeVariant(
      cookieStore.get(DEMO_TILTAKSPAKKE_VARIANT_COOKIE)?.value,
    );
    const scenario = resolveDemoScenario(
      AG_SCENARIO_OPTIONS,
      parseDemoScenario(cookieStore.get(DEMO_SCENARIO_COOKIE)?.value),
      variant,
    );
    await simulateBackendDelay();

    return scenario === "tom" ? mockTomtUtkastResponse : mockUtkastResponse;
  }

  const lagretUtkastResponse = await tokenXFetchGet({
    eventType:
      RuntimeErrorEvent.OPPFOLGINGSPLAN_ARBEIDSGIVER_UTKAST_FETCH_FAILED,
    targetApi: TokenXTargetApi.SYFO_OPPFOLGINGSPLAN_BACKEND,
    endpoint: getEndpointUtkastForAG(narmesteLederId),
    responseDataSchema: rawUtkastResponseForAGSchema,
    redirectAfterLoginUrl: getRedirectAfterLoginUrlForAG(narmesteLederId),
  });

  if (lagretUtkastResponse.utkast) {
    const rawUtkastResponseContent = lagretUtkastResponse.utkast.content;
    const convertedUtkast = convertPlanContentToCurrentSchema(
      rawUtkastResponseContent,
    );

    return {
      ...lagretUtkastResponse,
      utkast: {
        ...lagretUtkastResponse.utkast,
        content: convertedUtkast,
      },
    };
  } else {
    return {
      ...lagretUtkastResponse,
      utkast: null,
    };
  }
}
