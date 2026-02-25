import "server-only";
import type z from "zod";
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
import type { FetchGetResult } from "./FetchResult";
import { getBackendRequestHeaders } from "./helpers";
import { validateResponseBody } from "./validateResponseBody";

/**
 * Makes "GET" request to backend with TokenX OBO token.
 * Returns either validated response data or a strongly typed error.
 *
 * This mirrors the update/server-action pattern ({ error, data }) to avoid
 * relying on Next.js error boundaries for domain-specific errors.
 */
export async function tokenXFetchGetWithResult<S extends z.ZodType>({
  targetApi,
  endpoint,
  responseDataSchema,
  redirectAfterLoginUrl,
}: {
  targetApi: TokenXTargetApi;
  endpoint: string;
  responseDataSchema: S;
  redirectAfterLoginUrl: string;
}): Promise<FetchGetResult<z.infer<S>>> {
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
    const errorResult = getAndLogFetchNetworkError({
      error,
      endpoint,
      method: "GET",
    });

    return { error: errorResult, data: null };
  }

  if (!response.ok) {
    const errorResult = await getAndLogErrorResultFromNonOkResponse({
      response,
      endpoint,
      method: "GET",
    });

    return { error: errorResult, data: null };
  }

  const { success, validatedData } = await validateResponseBody({
    response,
    responseDataSchema,
    endpoint,
    method: "GET",
  });

  if (success) {
    return { error: null, data: validatedData };
  }

  return {
    error: {
      type: FrontendErrorType.OK_RESPONSE_BUT_RESPONSE_BODY_INVALID,
    },
    data: null,
  };
}
