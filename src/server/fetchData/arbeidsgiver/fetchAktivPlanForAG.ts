import { getRedirectAfterLoginUrlForAG } from "@/auth/redirectToLogin";
import { getEndpointAktivPlanForAG } from "@/common/backend-endpoints-ag";
import { isLocalOrDemo } from "@/env-variables/envHelpers";
import {
  FerdigstiltPlanResponseForAG,
  ferdigstiltPlanResponseForAGSchema,
} from "@/schema/ferdigstiltPlanResponseSchemas";
import { TokenXTargetApi } from "../../helpers";
import { tokenXFetchGet } from "../../tokenXFetch";
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
