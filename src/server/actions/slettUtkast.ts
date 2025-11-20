"use server";

import { refresh } from "next/cache";
import { getEndpointUtkastForAG } from "@/common/backend-endpoints";
import { isLocalOrDemo } from "@/env-variables/envHelpers";
import { simulateBackendDelay } from "../fetchData/mockData/simulateBackendDelay";
import { TokenXTargetApi } from "../helpers";
import { tokenXFetchUpdate } from "../tokenXFetch";

export type SlettUtkastActionState = {
  error: string | null;
};

export async function slettUtkastServerAction(
  narmesteLederId: string,
): Promise<SlettUtkastActionState> {
  if (isLocalOrDemo) {
    await simulateBackendDelay();

    refresh();
    return { error: null };
  }

  await tokenXFetchUpdate({
    targetApi: TokenXTargetApi.SYFO_OPPFOLGINGSPLAN_BACKEND,
    method: "DELETE",
    endpoint: getEndpointUtkastForAG(narmesteLederId),
  });

  refresh();
  return { error: null };
}
