"use server";

import z from "zod";
import { getEndpointDelMedVeilederForAG } from "@/common/backend-endpoints";
import { isLocalOrDemo } from "@/env-variables/envHelpers";
import { now } from "@/utils/dateAndTime/dateUtils";
import { TokenXTargetApi } from "../auth/tokenXExchange";
import { simulateBackendDelay } from "../fetchData/mockData/simulateBackendDelay";
import type { FetchResultError } from "../tokenXFetch/FetchResult";
import { tokenXFetchUpdateWithResponse } from "../tokenXFetch/tokenXFetchUpdate";

export type DelPlanMedVeilederActionState = {
  deltMedVeilederTidspunkt: string | null;
  errorDelMedVeileder: FetchResultError | null;
};

const delPlanMedVeilederResponseSchema = z.object({
  deltMedVeilederTidspunkt: z.iso.datetime(),
});

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

  const { data, error } = await tokenXFetchUpdateWithResponse({
    targetApi: TokenXTargetApi.SYFO_OPPFOLGINGSPLAN_BACKEND,
    endpoint: getEndpointDelMedVeilederForAG(narmesteLederId, planId),
    responseDataSchema: delPlanMedVeilederResponseSchema,
  });

  if (error) {
    return {
      deltMedVeilederTidspunkt: null,
      errorDelMedVeileder: error,
    };
  } else {
    return {
      deltMedVeilederTidspunkt: data.deltMedVeilederTidspunkt,
      errorDelMedVeileder: null,
    };
  }
}
