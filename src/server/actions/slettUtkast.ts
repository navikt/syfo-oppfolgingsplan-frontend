"use server";

import { refresh } from "next/cache";
import { getEndpointUtkastForAG } from "@/common/backend-endpoints";
import { StandardActionErrorType } from "@/common/types/errors.ts";
import { isLocalOrDemo } from "@/env-variables/envHelpers";
import { TokenXTargetApi } from "../auth/tokenXExchange";
import { simulateBackendDelay } from "../fetchData/mockData/simulateBackendDelay";
import { FetchUpdateResult } from "../tokenXFetch/FetchResult";
import { tokenXFetchUpdate } from "../tokenXFetch/tokenXFetchUpdate";

export async function slettUtkastServerAction(
  narmesteLederId: string,
): Promise<FetchUpdateResult<StandardActionErrorType>> {
  if (isLocalOrDemo) {
    await simulateBackendDelay();

    refresh();
    return { success: true, data: undefined };
  }

  const result = await tokenXFetchUpdate({
    targetApi: TokenXTargetApi.SYFO_OPPFOLGINGSPLAN_BACKEND,
    method: "DELETE",
    endpoint: getEndpointUtkastForAG(narmesteLederId),
  });

  if (!result.success) {
    return result as FetchUpdateResult<StandardActionErrorType>;
  } else {
    refresh();
    return { success: true, data: undefined };
  }
}
