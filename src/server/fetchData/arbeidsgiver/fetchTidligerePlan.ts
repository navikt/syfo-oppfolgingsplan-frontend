import { getRedirectAfterLoginUrlForAG } from "@/auth/redirectToLogin";
import { getEndpointTidligerePlanForAG } from "@/common/backend-endpoints";
import { isLocalOrDemo } from "@/env-variables/envHelpers";
import {
  FerdigstiltPlanResponseForAG,
  ferdigstiltPlanResponseForAGSchema,
} from "@/schema/ferdigstiltPlanResponseSchemas";
import { TokenXTargetApi } from "../../helpers";
import { tokenXFetchGet } from "../../tokenXFetch";
import { getMockTidligerePlanData } from "../mockData/mockHelpers";
import { simulateBackendDelay } from "../mockData/simulateBackendDelay";

export async function fetchTidligerePlanForAG(
  narmesteLederId: string,
  planId: string,
): Promise<FerdigstiltPlanResponseForAG> {
  if (isLocalOrDemo) {
    await simulateBackendDelay();
    return getMockTidligerePlanData(planId);
  }

  return await tokenXFetchGet({
    targetApi: TokenXTargetApi.SYFO_OPPFOLGINGSPLAN_BACKEND,
    endpoint: getEndpointTidligerePlanForAG(narmesteLederId, planId),
    responseDataSchema: ferdigstiltPlanResponseForAGSchema,
    redirectAfterLoginUrl: getRedirectAfterLoginUrlForAG(narmesteLederId),
  });
}
