import { getEndpointAktivPlanForAG } from "@/common/backend-endpoints";
import { isLocalOrDemo } from "@/env-variables/envHelpers";
import {
  FerdigstiltPlanResponseForAG,
  ferdigstiltPlanResponseForAGSchema,
} from "@/schema/ferdigstiltPlanResponseSchemas";
import { getRedirectAfterLoginUrlForAG } from "@/server/auth/redirectToLogin";
import { TokenXTargetApi } from "@/server/auth/tokenXExchange";
import { tokenXFetchGet } from "../../tokenXFetch/tokenXFetchGet";
import { getMockAktivPlanData } from "../mockData/mockHelpers";
import { simulateBackendDelay } from "../mockData/simulateBackendDelay";

export async function fetchAktivPlanForAG(
  narmesteLederId: string,
): Promise<FerdigstiltPlanResponseForAG> {
  if (isLocalOrDemo) {
    await simulateBackendDelay();
    return getMockAktivPlanData();
  }

  return await tokenXFetchGet({
    targetApi: TokenXTargetApi.SYFO_OPPFOLGINGSPLAN_BACKEND,
    endpoint: getEndpointAktivPlanForAG(narmesteLederId),
    responseDataSchema: ferdigstiltPlanResponseForAGSchema,
    redirectAfterLoginUrl: getRedirectAfterLoginUrlForAG(narmesteLederId),
  });
}
