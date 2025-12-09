"use server";

import { getEndpointDelMedLegeForAG } from "@/common/backend-endpoints";
import { isLocalOrDemo } from "@/env-variables/envHelpers";
import { now } from "@/utils/dateAndTime/dateUtils";
import { TokenXTargetApi } from "../auth/tokenXExchange";
import { simulateBackendDelay } from "../fetchData/mockData/simulateBackendDelay";
import { tokenXFetchUpdate } from "../tokenXFetch/tokenXFetchUpdate";

export interface DelPlanMedLegeActionState {
  deltMedLegeTidspunkt: string | null;
  errorDelMedLege: string | null;
}

export async function delPlanMedLegeServerAction(
  narmesteLederId: string,
  planId: string,
): Promise<DelPlanMedLegeActionState> {
  if (isLocalOrDemo) {
    await simulateBackendDelay();

    return {
      deltMedLegeTidspunkt: now().toISOString(),
      errorDelMedLege: null,
    };
  }

  await tokenXFetchUpdate({
    targetApi: TokenXTargetApi.SYFO_OPPFOLGINGSPLAN_BACKEND,
    endpoint: getEndpointDelMedLegeForAG(narmesteLederId, planId),
  });

  return {
    deltMedLegeTidspunkt: now().toISOString(),
    errorDelMedLege: null,
  };
}
