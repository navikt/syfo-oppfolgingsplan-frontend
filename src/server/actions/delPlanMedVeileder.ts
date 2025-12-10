"use server";

import { getEndpointDelMedVeilederForAG } from "@/common/backend-endpoints";
import { DelPlanMedVeilederErrorType } from "@/common/types/errors";
import { isLocalOrDemo } from "@/env-variables/envHelpers";
import { TokenXTargetApi } from "../auth/tokenXExchange";
import { simulateBackendDelay } from "../fetchData/mockData/simulateBackendDelay";
import { FetchUpdateResultWithResponse } from "../tokenXFetch/FetchResult";
import { tokenXFetchUpdate } from "../tokenXFetch/tokenXFetchUpdate";

export interface DelMedVeilederResponse {
  deltMedVeilederTidspunkt: string;
}

export async function delPlanMedVeilederServerAction(
  narmesteLederId: string,
  planId: string,
): Promise<
  FetchUpdateResultWithResponse<
    DelMedVeilederResponse,
    DelPlanMedVeilederErrorType
  >
> {
  if (isLocalOrDemo) {
    await simulateBackendDelay();

    return {
      success: true,
      data: {
        deltMedVeilederTidspunkt: new Date().toISOString(),
      },
    };
  }

  const result = (await tokenXFetchUpdate({
    targetApi: TokenXTargetApi.SYFO_OPPFOLGINGSPLAN_BACKEND,
    endpoint: getEndpointDelMedVeilederForAG(narmesteLederId, planId),
  })) as FetchUpdateResultWithResponse<
    DelMedVeilederResponse,
    DelPlanMedVeilederErrorType
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
      deltMedVeilederTidspunkt: new Date().toISOString(),
    },
  };
}
