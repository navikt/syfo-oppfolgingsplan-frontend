import "server-only";
import z from "zod";
import { FrontendErrorType } from "../actions/FrontendErrorTypeEnum";
import { validateAndGetIdPortenTokenOrRedirectToLogin } from "../auth/idPortenToken";
import { exchangeIdPortenTokenForTokenXOboToken } from "../auth/tokenXExchange";
import { TokenXTargetApi } from "../auth/tokenXExchange";
import { FetchResultError } from "./FetchResult";
import {
  getAndLogErrorResultFromNonOkResponse,
  getAndLogFetchNetworkError,
} from "./errorHandling";
import { getBackendRequestHeaders } from "./helpers";
import { validateResposeBody } from "./validateResposeBody";

/**
 * Makes "GET" request to backend with TokenX OBO token.
 * Returns response data validated with zod schema, or throws an error result if
 * something goes wrong. The error is then meant to be catched in an error boundary.
 */
export async function tokenXFetchGet<S extends z.ZodType>({
  targetApi,
  endpoint,
  responseDataSchema,
  redirectAfterLoginUrl,
}: {
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
      endpoint,
      method: "GET",
    });

    throw errorResult;
  }

  if (!response.ok) {
    const errorResult = getAndLogErrorResultFromNonOkResponse({
      response,
      endpoint,
      method: "GET",
    });

    throw errorResult;
  }

  // Response status is ok, parse response data
  const { success, validatedData } = await validateResposeBody({
    response,
    responseDataSchema,
    endpoint,
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
