"use server";

import { getEndpointDelMedLegeForAG } from "@/common/backend-endpoints";
import { isLocalOrDemo } from "@/env-variables/envHelpers";
import { now } from "@/utils/dateAndTime/dateUtils";
import { TokenXTargetApi } from "../auth/tokenXExchange";
import { simulateBackendDelay } from "../fetchData/mockData/simulateBackendDelay";
import { FetchUpdateResultWithResponse } from "../tokenXFetch/FetchResult";
import { tokenXFetchUpdate } from "../tokenXFetch/tokenXFetchUpdate";

export async function delPlanMedLegeServerAction(
  narmesteLederId: string,
  planId: string,
): Promise<FetchUpdateResultWithResponse<{ deltMedLegeTidspunkt: string }>> {
  if (isLocalOrDemo) {
    await simulateBackendDelay();

    return {
      data: {
        deltMedLegeTidspunkt: now().toISOString(),
      },
      error: null,
    };
  }

  // Can return directly from here after updating backend to respond with
  // deltMedLegeTidspunkt
  const result = await tokenXFetchUpdate({
    targetApi: TokenXTargetApi.SYFO_OPPFOLGINGSPLAN_BACKEND,
    endpoint: getEndpointDelMedLegeForAG(narmesteLederId, planId),
  });

  if (result.error) {
    return {
      data: null,
      error: result.error,
    };
  } else {
    return {
      data: {
        deltMedLegeTidspunkt: now().toISOString(),
      },
      error: null,
    };
  }
}
