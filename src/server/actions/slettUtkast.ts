"use server";

import { refresh } from "next/cache";
import { getEndpointUtkastForAG } from "@/common/backend-endpoints";
import { isLocalOrDemo } from "@/env-variables/envHelpers";
import { TokenXTargetApi } from "../auth/tokenXExchange";
import { simulateBackendDelay } from "../fetchData/mockData/simulateBackendDelay";
import { FetchUpdateResult } from "../tokenXFetch/FetchResult";
import { tokenXFetchUpdate } from "../tokenXFetch/tokenXFetchUpdate";

export async function slettUtkastServerAction(
  narmesteLederId: string,
): Promise<FetchUpdateResult> {
  if (isLocalOrDemo) {
    await simulateBackendDelay();

    refresh();
    return { error: null };
  }

  const result = await tokenXFetchUpdate({
    targetApi: TokenXTargetApi.SYFO_OPPFOLGINGSPLAN_BACKEND,
    method: "DELETE",
    endpoint: getEndpointUtkastForAG(narmesteLederId),
  });

  if (result.error) {
    return result;
  } else {
    refresh();
    return { error: null };
  }
}
