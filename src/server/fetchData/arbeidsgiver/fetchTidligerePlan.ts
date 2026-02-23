import { getEndpointFerdigstiltPlanForAG } from "@/common/backend-endpoints";
import { isLocalOrDemo } from "@/env-variables/envHelpers";
import {
  type FerdigstiltPlanResponse,
  ferdigstiltPlanResponseSchema,
} from "@/schema/ferdigstiltPlanResponseSchemas";
import { getRedirectAfterLoginUrlForAG } from "@/server/auth/redirectToLogin";
import { TokenXTargetApi } from "@/server/auth/tokenXExchange";
import { tokenXFetchGet } from "../../tokenXFetch/tokenXFetchGet";
import { getMockFerdigstiltPlanData } from "../mockData/mockHelpers";
import { simulateBackendDelay } from "../mockData/simulateBackendDelay";

export async function fetchTidligerePlanForAG(
  narmesteLederId: string,
  planId: string,
): Promise<FerdigstiltPlanResponse> {
  if (isLocalOrDemo) {
    await simulateBackendDelay();
    return getMockFerdigstiltPlanData(planId);
  }

  return await tokenXFetchGet({
    targetApi: TokenXTargetApi.SYFO_OPPFOLGINGSPLAN_BACKEND,
    endpoint: getEndpointFerdigstiltPlanForAG(narmesteLederId, planId),
    responseDataSchema: ferdigstiltPlanResponseSchema,
    redirectAfterLoginUrl: getRedirectAfterLoginUrlForAG(narmesteLederId),
  });
}
