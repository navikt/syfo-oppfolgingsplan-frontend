"use server";

import { getEndpointDelMedVeilederForAG } from "@/common/backend-endpoints";
import { isLocalOrDemo } from "@/env-variables/envHelpers";
import { now } from "@/utils/dateAndTime/dateUtils";
import { TokenXTargetApi } from "../auth/tokenXExchange";
import { simulateBackendDelay } from "../fetchData/mockData/simulateBackendDelay";
import { tokenXFetchUpdate } from "../tokenXFetch/tokenXFetchUpdate";

export type DelPlanMedVeilederActionState = {
  deltMedVeilederTidspunkt: string | null;
  errorDelMedVeileder: string | null;
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

  await tokenXFetchUpdate({
    targetApi: TokenXTargetApi.SYFO_OPPFOLGINGSPLAN_BACKEND,
    endpoint: getEndpointDelMedVeilederForAG(narmesteLederId, planId),
  });

  return {
    deltMedVeilederTidspunkt: now().toISOString(),
    errorDelMedVeileder: null,
  };
}
