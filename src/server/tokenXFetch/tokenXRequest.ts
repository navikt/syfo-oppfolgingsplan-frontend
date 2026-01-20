import "server-only";
import { validateAndGetIdPortenToken } from "../auth/idPortenToken";
import { validateAndGetIdPortenTokenOrRedirectToLogin } from "../auth/idPortenToken";
import {
  TokenXTargetApi,
  exchangeIdPortenTokenForTokenXOboToken,
} from "../auth/tokenXExchange";
import { FetchResultError } from "./FetchResult";
import {
  getAndLogErrorResultFromNonOkResponse,
  getAndLogFetchNetworkError,
} from "./errorHandling";
import { getBackendRequestHeaders } from "./helpers";

type RequestMethod = "GET" | "POST" | "PUT" | "DELETE";

export async function tokenXRequest({
  targetApi,
  endpoint,
  method,
  requestBody,
  redirectAfterLoginUrl,
}: {
  targetApi: TokenXTargetApi;
  endpoint: string;
  method: RequestMethod;
  requestBody?: unknown;
  /** If provided, uses redirect-on-invalid-token validation */
  redirectAfterLoginUrl?: string;
}): Promise<
  | { error: FetchResultError; response?: undefined }
  | { error: null; response: Response }
> {
  let oboToken: string;
  try {
    const idPortenToken = redirectAfterLoginUrl
      ? await validateAndGetIdPortenTokenOrRedirectToLogin(
          redirectAfterLoginUrl,
        )
      : await validateAndGetIdPortenToken();

    oboToken = await exchangeIdPortenTokenForTokenXOboToken(
      idPortenToken,
      targetApi,
    );
  } catch (error) {
    // Auth/token exchange errors are thrown as FetchResultError from our auth helpers
    return { error: error as FetchResultError };
  }

  let response: Response;
  try {
    response = await fetch(endpoint, {
      method,
      body: requestBody ? JSON.stringify(requestBody) : undefined,
      headers: getBackendRequestHeaders(oboToken),
    });
  } catch (error) {
    const errorResult = getAndLogFetchNetworkError({ error, endpoint, method });
    return { error: errorResult };
  }

  if (!response.ok) {
    const errorResult = await getAndLogErrorResultFromNonOkResponse({
      response,
      endpoint,
      method,
    });

    return { error: errorResult };
  }

  return { error: null, response };
}
