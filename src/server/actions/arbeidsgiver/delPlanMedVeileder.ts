"use server";

import { getEndpointDelMedVeilederForAG } from "@/common/backend-endpoints-ag";
import { isLocalOrDemo } from "@/env-variables/envHelpers";
import { simulateBackendDelay } from "../../fetchData/mockData/simulateBackendDelay";
import { TokenXTargetApi } from "../../helpers";
import { tokenXFetchUpdate } from "../../tokenXFetch";

export type DelPlanMedVeilederActionState = {
  deltMedVeilederTidspunkt: Date | null;
  errorDelMedVeileder: string | null;
};

export async function delPlanMedVeilederServerAction(
  narmesteLederId: string,
  planId: string,
): Promise<DelPlanMedVeilederActionState> {
  if (isLocalOrDemo) {
    await simulateBackendDelay();

    return {
      deltMedVeilederTidspunkt: new Date(),
      errorDelMedVeileder: null,
    };
  }

  await tokenXFetchUpdate({
    targetApi: TokenXTargetApi.SYFO_OPPFOLGINGSPLAN_BACKEND,
    endpoint: getEndpointDelMedVeilederForAG(narmesteLederId, planId),
  });

  // satisfy typescript for now
  return {
    deltMedVeilederTidspunkt: new Date(),
    errorDelMedVeileder: null,
  };
}
