import { getRedirectAfterLoginUrlForAG } from "@/auth/redirectToLogin";
import {
  getEndpointAktivPlanForAG,
  getEndpointTidligerePlanForAG,
} from "@/common/backend-endpoints";
import { isLocalOrDemo } from "@/env-variables/envHelpers";
import {
  FerdigstiltPlanResponseForAG,
  ferdigstiltPlanResponseForAGSchema,
} from "@/schema/ferdigstiltPlanResponseSchemas";
import { TokenXTargetApi } from "../../helpers";
import { tokenXFetchGet } from "../../tokenXFetch";
import { mockFerdigstiltPlanResponse } from "../demoMockData/mockFerdistiltPlanResponse";
import { simulateBackendDelay } from "../demoMockData/simulateBackendDelay";

export async function fetchAktivPlanForAG(
  narmesteLederId: string,
): Promise<FerdigstiltPlanResponseForAG> {
  if (isLocalOrDemo) {
    await simulateBackendDelay();
    return mockFerdigstiltPlanResponse;
  }

  return await tokenXFetchGet({
    targetApi: TokenXTargetApi.SYFO_OPPFOLGINGSPLAN_BACKEND,
    endpoint: getEndpointAktivPlanForAG(narmesteLederId),
    responseDataSchema: ferdigstiltPlanResponseForAGSchema,
    redirectAfterLoginUrl: getRedirectAfterLoginUrlForAG(narmesteLederId),
  });
}

export async function fetchTidligerePlanForAG(
  narmesteLederId: string,
  planId: string,
): Promise<FerdigstiltPlanResponseForAG> {
  if (isLocalOrDemo) {
    await simulateBackendDelay();
    return mockFerdigstiltPlanResponse;
  }

  return await tokenXFetchGet({
    targetApi: TokenXTargetApi.SYFO_OPPFOLGINGSPLAN_BACKEND,
    endpoint: getEndpointTidligerePlanForAG(narmesteLederId, planId),
    responseDataSchema: ferdigstiltPlanResponseForAGSchema,
    redirectAfterLoginUrl: getRedirectAfterLoginUrlForAG(narmesteLederId),
  });
}
