"use server";

import { refresh } from "next/cache";
import { getEndpointBeOmPlan } from "@/common/backend-endpoints";
import { isLocalOrDemo } from "@/env-variables/envHelpers";
import { TokenXTargetApi } from "../auth/tokenXExchange";
import { simulateBackendDelay } from "../fetchData/mockData/simulateBackendDelay";
import type { FetchUpdateResult } from "../tokenXFetch/FetchResult";
import { tokenXFetchUpdate } from "../tokenXFetch/tokenXFetchUpdate";
import { FrontendErrorType } from "./FrontendErrorTypeEnum";

const NINE_DIGIT_ORG_NUMBER = /^\d{9}$/;

export async function beOmPlanServerAction(
  organisasjonsnummer: string,
): Promise<FetchUpdateResult> {
  if (!NINE_DIGIT_ORG_NUMBER.test(organisasjonsnummer)) {
    return {
      error: { type: FrontendErrorType.SERVER_ACTION_INPUT_VALIDATION_ERROR },
    };
  }

  if (isLocalOrDemo) {
    await simulateBackendDelay();

    refresh();
    return { error: null };
  }

  const result = await tokenXFetchUpdate({
    targetApi: TokenXTargetApi.SYFO_OPPFOLGINGSPLAN_BACKEND,
    method: "POST",
    endpoint: getEndpointBeOmPlan(),
    requestBody: { organisasjonsnummer },
  });

  if (result.error) {
    return result;
  } else {
    refresh();
    return { error: null };
  }
}
