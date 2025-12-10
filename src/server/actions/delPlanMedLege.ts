"use server";

import { getEndpointDelMedLegeForAG } from "@/common/backend-endpoints";
import { DelPlanMedLegeErrorType } from "@/common/types/errors";
import { isLocalOrDemo } from "@/env-variables/envHelpers";
import { now } from "@/utils/dateAndTime/dateUtils";
import { TokenXTargetApi } from "../auth/tokenXExchange";
import { simulateBackendDelay } from "../fetchData/mockData/simulateBackendDelay";
import { FetchUpdateResultWithResponse } from "../tokenXFetch/FetchResult";
import { tokenXFetchUpdate } from "../tokenXFetch/tokenXFetchUpdate";

export interface DelMedLegeResponse {
  deltMedLegeTidspunkt: string;
}

export async function delPlanMedLegeServerAction(
  narmesteLederId: string,
  planId: string,
): Promise<
  FetchUpdateResultWithResponse<DelMedLegeResponse, DelPlanMedLegeErrorType>
> {
  if (isLocalOrDemo) {
    await simulateBackendDelay();

    return {
      success: true,
      data: {
        deltMedLegeTidspunkt: now().toISOString(),
      },
    };
  }

  const result = (await tokenXFetchUpdate({
    targetApi: TokenXTargetApi.SYFO_OPPFOLGINGSPLAN_BACKEND,
    endpoint: getEndpointDelMedLegeForAG(narmesteLederId, planId),
  })) as FetchUpdateResultWithResponse<
    DelMedLegeResponse,
    DelPlanMedLegeErrorType
  >;

  if (!result.success) {
    return {
      success: false,
      error: result.error,
    };
  }

  return {
    success: true,
    data: {
      deltMedLegeTidspunkt: now().toISOString(),
    },
  };
}
