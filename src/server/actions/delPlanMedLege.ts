"use server";

import z from "zod";
import { getEndpointDelMedLegeForAG } from "@/common/backend-endpoints";
import { isLocalOrDemo } from "@/env-variables/envHelpers";
import { now } from "@/utils/dateAndTime/dateUtils";
import { TokenXTargetApi } from "../auth/tokenXExchange";
import { simulateBackendDelay } from "../fetchData/mockData/simulateBackendDelay";
import type { FetchResultError } from "../tokenXFetch/FetchResult";
import { tokenXFetchUpdateWithResponse } from "../tokenXFetch/tokenXFetchUpdate";

export interface DelPlanMedLegeActionState {
  deltMedLegeTidspunkt: string | null;
  errorDelMedLege: FetchResultError | null;
}

const delPlanMedLegeResponseSchema = z.object({
  deltMedLegeTidspunkt: z.iso.datetime(),
});

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

  const { data, error } = await tokenXFetchUpdateWithResponse({
    targetApi: TokenXTargetApi.SYFO_OPPFOLGINGSPLAN_BACKEND,
    endpoint: getEndpointDelMedLegeForAG(narmesteLederId, planId),
    responseDataSchema: delPlanMedLegeResponseSchema,
  });

  if (error) {
    return {
      deltMedLegeTidspunkt: null,
      errorDelMedLege: error,
    };
  } else {
    return {
      deltMedLegeTidspunkt: data.deltMedLegeTidspunkt,
      errorDelMedLege: null,
    };
  }
}
