"use server";

import { getEndpointDelMedLegeForAG } from "@/common/backend-endpoints";
import { isLocalOrDemo } from "@/env-variables/envHelpers";
import { TokenXTargetApi } from "../auth/tokenXExchange";
import { simulateBackendDelay } from "../fetchData/mockData/simulateBackendDelay";
import { tokenXFetchUpdate } from "../tokenXFetch/tokenXFetchUpdate";

export interface DelPlanMedLegeActionState {
  deltMedLegeTidspunkt: Date | null;
  errorDelMedLege: string | null;
}

export async function delPlanMedLegeServerAction(
  narmesteLederId: string,
  planId: string,
): Promise<DelPlanMedLegeActionState> {
  if (isLocalOrDemo) {
    await simulateBackendDelay();

    return {
      deltMedLegeTidspunkt: new Date(),
      errorDelMedLege: null,
    };
  }

  const fetchResult = await tokenXFetchUpdate({
    targetApi: TokenXTargetApi.SYFO_OPPFOLGINGSPLAN_BACKEND,
    endpoint: getEndpointDelMedLegeForAG(narmesteLederId, planId),
  });

  if (fetchResult.error) {
    return {
      deltMedLegeTidspunkt: null,
      errorDelMedLege:
        fetchResult.error.message || "Ukjent feil ved deling med lege",
    };
  } else {
    return {
      deltMedLegeTidspunkt: new Date(),
      errorDelMedLege: null,
    };
  }
}
