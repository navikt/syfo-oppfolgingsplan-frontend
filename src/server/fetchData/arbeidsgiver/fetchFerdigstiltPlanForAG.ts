import { getRedirectAfterLoginUrlForAG } from "@/auth/redirectToLogin";
import { isLocalOrDemo } from "@/env-variables/envHelpers";
import { getServerEnv } from "@/env-variables/serverEnv";
import {
  FerdigstiltPlanResponseForAG,
  ferdigstiltPlanResponseForAGSchema,
} from "@/schema/ferdigstiltPlanResponseSchema";
import { TokenXTargetApi } from "../../helpers";
import { tokenXFetchGet } from "../../tokenXFetch";
import { mockFerdigstiltPlanResponse } from "../demoMockData/mockFerdistiltPlanResponse";
import { simulateBackendDelay } from "../demoMockData/simulateBackendDelay";

const getEndpointFerdigstiltPlanForAG = (
  narmesteLederId: string,
  planId: string,
) =>
  `${getServerEnv().SYFO_OPPFOLGINGSPLAN_BACKEND_HOST}/api/v1/arbeidsgiver/${narmesteLederId}/oppfolgingsplaner/${planId}`;

export async function fetchFerdigstiltPlanForAG(
  narmesteLederId: string,
  planId: string,
): Promise<FerdigstiltPlanResponseForAG> {
  if (isLocalOrDemo) {
    await simulateBackendDelay();
    return mockFerdigstiltPlanResponse;
  }

  return await tokenXFetchGet({
    targetApi: TokenXTargetApi.SYFO_OPPFOLGINGSPLAN_BACKEND,
    endpoint: getEndpointFerdigstiltPlanForAG(narmesteLederId, planId),
    responseDataSchema: ferdigstiltPlanResponseForAGSchema,
    redirectAfterLoginUrl: getRedirectAfterLoginUrlForAG(narmesteLederId),
  });
}
