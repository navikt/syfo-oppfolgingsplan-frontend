import "server-only";
import type z from "zod";
import type { RuntimeErrorEvent } from "@/common/runtimeErrorEvent";
import { FrontendErrorType } from "../actions/FrontendErrorTypeEnum";
import { validateAndGetIdPortenTokenOrRedirectToLogin } from "../auth/idPortenToken";
import {
  exchangeIdPortenTokenForTokenXOboToken,
  type TokenXTargetApi,
} from "../auth/tokenXExchange";
import {
  getAndLogErrorResultFromNonOkResponse,
  getAndLogFetchNetworkError,
} from "./errorHandling";
import type { FetchResultError } from "./FetchResult";
import { getBackendRequestHeaders } from "./helpers";
import { validateResponseBody } from "./validateResponseBody";

/**
 * Makes "GET" request to backend with TokenX OBO token.
 * Returns response data validated with zod schema, or throws an error result if
 * something goes wrong. The error is then meant to be catched in an error boundary.
 */
export async function tokenXFetchGet<S extends z.ZodType>({
  eventType,
  targetApi,
  endpoint,
  responseDataSchema,
  redirectAfterLoginUrl,
}: {
  eventType: RuntimeErrorEvent;
  targetApi: TokenXTargetApi;
  endpoint: string;
  responseDataSchema: S;
  redirectAfterLoginUrl: string;
}): Promise<z.infer<S>> {
  const idPortenToken = await validateAndGetIdPortenTokenOrRedirectToLogin(
    redirectAfterLoginUrl,
  );

  const oboToken = await exchangeIdPortenTokenForTokenXOboToken(
    idPortenToken,
    targetApi,
  );

  let response: Response;
  try {
    response = await fetch(endpoint, {
      headers: getBackendRequestHeaders(oboToken),
    });
  } catch (error) {
    // The fetch call threw an error
    const errorResult = getAndLogFetchNetworkError({
      error,
      eventType,
      method: "GET",
    });

    throw errorResult;
  }

  if (!response.ok) {
    const errorResult = await getAndLogErrorResultFromNonOkResponse({
      eventType,
      response,
      method: "GET",
    });

    throw errorResult;
  }

  // Response status is ok, parse response data
  const { success, validatedData } = await validateResponseBody({
    eventType,
    response,
    responseDataSchema,
    method: "GET",
  });
  if (success) {
    return validatedData;
  } else {
    throw {
      type: FrontendErrorType.OK_RESPONSE_BUT_RESPONSE_BODY_INVALID,
    } as FetchResultError;
  }
}
