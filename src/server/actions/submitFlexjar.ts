"use server";

import { getServerEnv, isLocalOrDemo } from "@/constants/envs";
import { authenticatedFetch } from "@/server/authenticatedFetch";
import { FetchResult } from "@/server/FetchResult";
import { FlexJarTransportPayload } from "@navikt/flexjar-widget";

export async function submitFlexjar(
  payload: FlexJarTransportPayload,
): Promise<FetchResult<void>> {
  if (isLocalOrDemo) {
    return { success: true, data: undefined };
  }

  return await authenticatedFetch({
    method: "POST",
    endpoint: `${getServerEnv().FLEXJAR_HOST}/api/v2/feedback`,
    clientId: getServerEnv().FLEXJAR_BACKEND_CLIENT_ID,
    body: JSON.stringify(payload),
  });
}
