"use server";

import { getEndpointDelMedVeilederForAG } from "@/common/backend-endpoints";
import { isLocalOrDemo } from "@/env-variables/envHelpers";
import { now } from "@/utils/dateAndTime/dateUtils";
import { TokenXTargetApi } from "../auth/tokenXExchange";
import { simulateBackendDelay } from "../fetchData/mockData/simulateBackendDelay";
import { FetchResultError } from "../tokenXFetch/FetchResult";
import { tokenXFetchUpdate } from "../tokenXFetch/tokenXFetchUpdate";

export type DelPlanMedVeilederActionState = {
  deltMedVeilederTidspunkt: string | null;
  errorDelMedVeileder: FetchResultError | null;
};

export async function delPlanMedVeilederServerAction(
  narmesteLederId: string,
  planId: string,
): Promise<DelPlanMedVeilederActionState> {
  if (isLocalOrDemo) {
    await simulateBackendDelay();

    return {
      deltMedVeilederTidspunkt: now().toISOString(),
      errorDelMedVeileder: null,
    };
  }

  const result = await tokenXFetchUpdate({
    targetApi: TokenXTargetApi.SYFO_OPPFOLGINGSPLAN_BACKEND,
    endpoint: getEndpointDelMedVeilederForAG(narmesteLederId, planId),
  });

  if (result.error) {
    return {
      deltMedVeilederTidspunkt: null,
      errorDelMedVeileder: result.error,
    };
  } else {
    return {
      deltMedVeilederTidspunkt: now().toISOString(),
      errorDelMedVeileder: null,
    };
  }
}
