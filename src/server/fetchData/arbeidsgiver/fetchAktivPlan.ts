import { getEndpointAktivPlanForAG } from "@/common/backend-endpoints";
import { RuntimeErrorEvent } from "@/common/runtimeErrorEvent";
import { isLocalOrDemo } from "@/env-variables/envHelpers";
import {
  type FerdigstiltPlanResponse,
  ferdigstiltPlanResponseSchema,
} from "@/schema/ferdigstiltPlanResponseSchemas";
import { getRedirectAfterLoginUrlForAG } from "@/server/auth/redirectToLogin";
import { TokenXTargetApi } from "@/server/auth/tokenXExchange";
import { tokenXFetchGet } from "../../tokenXFetch/tokenXFetchGet";
import { getMockFerdigstiltPlanData } from "../mockData/mockHelpers";
import { mockAktivPlanData } from "../mockData/mockPlanerData";
import { simulateBackendDelay } from "../mockData/simulateBackendDelay";

export async function fetchAktivPlanForAG(
  narmesteLederId: string,
): Promise<FerdigstiltPlanResponse> {
  if (isLocalOrDemo) {
    await simulateBackendDelay();
    return getMockFerdigstiltPlanData(mockAktivPlanData.id);
  }

  return await tokenXFetchGet({
    eventType: RuntimeErrorEvent.OPPFOLGINGSPLAN_EMPLOYER_ACTIVE_FETCH_FAILED,
    targetApi: TokenXTargetApi.SYFO_OPPFOLGINGSPLAN_BACKEND,
    endpoint: getEndpointAktivPlanForAG(narmesteLederId),
    responseDataSchema: ferdigstiltPlanResponseSchema,
    redirectAfterLoginUrl: getRedirectAfterLoginUrlForAG(narmesteLederId),
  });
}
