"use server";

import { z } from "zod";
import { FlexJarTransportPayload } from "@navikt/flexjar-widget";
import { getFlexjarFeedbackEndpoint } from "@/common/backend-endpoints";
import { isLocalOrDemo } from "@/env-variables/envHelpers";
import { flexjarTransportSchema } from "@/schema/flexjarTransportPayloadSchema.ts";
import { TokenXTargetApi } from "../auth/tokenXExchange";
import { simulateBackendDelay } from "../fetchData/mockData/simulateBackendDelay";
import { tokenXFetchUpdateWithResponse } from "../tokenXFetch/tokenXFetchUpdate";

const flexjarResponseSchema = z.object({
  id: z.string(),
});

export async function submitFlexjarFeedback(
  payload: FlexJarTransportPayload,
): Promise<{ id: string }> {
  const validatedPayload = flexjarTransportSchema.parse(payload);

  if (isLocalOrDemo) {
    await simulateBackendDelay();
    return { id: "123" };
  }

  const result = await tokenXFetchUpdateWithResponse({
    targetApi: TokenXTargetApi.FLEXJAR_BACKEND,
    endpoint: getFlexjarFeedbackEndpoint(),
    requestBody: validatedPayload,
    responseDataSchema: flexjarResponseSchema,
  });

  if (!result.success) {
    throw new Error("Failed to submit feedback");
  }

  return result.data;
}
