"use server";

import { refresh } from "next/cache";
import { getEndpointUnntaksvurderingerForAG } from "@/common/backend-endpoints";
import { isLocalOrDemo } from "@/env-variables/envHelpers";
import { TokenXTargetApi } from "../auth/tokenXExchange";
import { simulateBackendDelay } from "../fetchData/mockData/simulateBackendDelay";
import type { FetchUpdateResult } from "../tokenXFetch/FetchResult";
import { tokenXFetchUpdate } from "../tokenXFetch/tokenXFetchUpdate";

export async function meldUnntaksvurderingServerAction(
  narmesteLederId: string,
): Promise<FetchUpdateResult> {
  if (isLocalOrDemo) {
    await simulateBackendDelay();

    refresh();
    return { error: null };
  }

  const result = await tokenXFetchUpdate({
    targetApi: TokenXTargetApi.SYFO_OPPFOLGINGSPLAN_BACKEND,
    method: "POST",
    endpoint: getEndpointUnntaksvurderingerForAG(narmesteLederId),
  });

  if (result.error) {
    return result;
  }

  refresh();
  return { error: null };
}
