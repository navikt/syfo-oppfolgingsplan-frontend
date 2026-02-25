"use server";

import type { LumiSurveyTransportPayload } from "@navikt/lumi-survey";
import { z } from "zod";
import { getLumiSurveyFeedbackEndpoint } from "@/common/backend-endpoints";
import { isLocalOrDemo } from "@/env-variables/envHelpers";
import { lumiSurveyTransportSchema } from "@/schema/lumiSurveyTransportPayloadSchema";
import { TokenXTargetApi } from "../auth/tokenXExchange";
import { simulateBackendDelay } from "../fetchData/mockData/simulateBackendDelay";
import { tokenXFetchUpdateWithResponse } from "../tokenXFetch/tokenXFetchUpdate";

const lumiResponseSchema = z.object({
  id: z.string(),
});

export async function submitLumiSurveyFeedback(
  payload: LumiSurveyTransportPayload,
): Promise<{ id: string }> {
  const validatedPayload = lumiSurveyTransportSchema.parse(payload);

  if (isLocalOrDemo) {
    await simulateBackendDelay();
    return { id: "123" };
  }

  const result = await tokenXFetchUpdateWithResponse({
    targetApi: TokenXTargetApi.LUMI_API,
    endpoint: getLumiSurveyFeedbackEndpoint(),
    requestBody: validatedPayload,
    responseDataSchema: lumiResponseSchema,
  });

  if (result.error) {
    throw new Error("Failed to submit feedback");
  }

  return result.data;
}
