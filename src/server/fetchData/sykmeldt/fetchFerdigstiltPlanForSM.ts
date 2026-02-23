import { isLocalOrDemo } from "@/env-variables/envHelpers";
import { getServerEnv } from "@/env-variables/serverEnv";
import {
  type FerdigstiltPlanResponse,
  ferdigstiltPlanResponseSchema,
} from "@/schema/ferdigstiltPlanResponseSchemas";
import { getRedirectAfterLoginUrlForSM } from "@/server/auth/redirectToLogin";
import { TokenXTargetApi } from "@/server/auth/tokenXExchange";
import { getMockFerdigstiltPlanData } from "@/server/fetchData/mockData/mockHelpers";
import { tokenXFetchGet } from "@/server/tokenXFetch/tokenXFetchGet";
import { simulateBackendDelay } from "../mockData/simulateBackendDelay";

export async function fetchFerdigstiltPlanForSM(
  planId: string,
): Promise<FerdigstiltPlanResponse> {
  if (isLocalOrDemo) {
    await simulateBackendDelay();
    return getMockFerdigstiltPlanData(planId);
  }

  return await tokenXFetchGet({
    targetApi: TokenXTargetApi.SYFO_OPPFOLGINGSPLAN_BACKEND,
    endpoint: `${getServerEnv().SYFO_OPPFOLGINGSPLAN_BACKEND_HOST}/api/v1/sykmeldt/oppfolgingsplaner/${planId}`,
    responseDataSchema: ferdigstiltPlanResponseSchema,
    redirectAfterLoginUrl: getRedirectAfterLoginUrlForSM(),
  });
}
