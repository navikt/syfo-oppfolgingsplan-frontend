"use server";

import { getEndpointDelMedLegeForAG } from "@/common/backend-endpoints";
import { isLocalOrDemo } from "@/env-variables/envHelpers";
import { simulateBackendDelay } from "../fetchData/mockData/simulateBackendDelay";
import { TokenXTargetApi } from "../helpers";
import { tokenXFetchUpdate } from "../tokenXFetch";

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

  await tokenXFetchUpdate({
    targetApi: TokenXTargetApi.SYFO_OPPFOLGINGSPLAN_BACKEND,
    endpoint: getEndpointDelMedLegeForAG(narmesteLederId, planId),
  });

  // satisfy typescript for now
  return {
    deltMedLegeTidspunkt: new Date(),
    errorDelMedLege: null,
  };
}
