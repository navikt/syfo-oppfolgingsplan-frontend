import "server-only";
import z from "zod";
import { FrontendErrorType } from "../actions/FrontendErrorTypeEnum";
import { validateAndGetIdPortenToken } from "../auth/idPortenToken";
import { exchangeIdPortenTokenForTokenXOboToken } from "../auth/tokenXExchange";
import { TokenXTargetApi } from "../auth/tokenXExchange";
import {
  FetchResultError,
  FetchUpdateResult,
  FetchUpdateResultWithResponse,
} from "./FetchResult";
import {
  getAndLogErrorResultFromNonOkResponse,
  getAndLogFetchNetworkError,
} from "./errorHandling";
import { getBackendRequestHeaders } from "./helpers";
import { validateResponseBody } from "./validateResponseBody";

/**
 * Makes "POST", "PUT" or "DELETE" request to backend with TokenX OBO token.
 * Expects and returns no response body.
 * The returned FetchUpdateResult will contain an error object if
 * something goes wrong.
 */
export async function tokenXFetchUpdate({
  targetApi,
  endpoint,
  requestBody,
  method = "POST",
}: {
  targetApi: TokenXTargetApi;
  endpoint: string;
  requestBody?: unknown;
  method?: "POST" | "PUT" | "DELETE";
}): Promise<FetchUpdateResult> {
  let oboToken: string;
  try {
    const idPortenToken = await validateAndGetIdPortenToken();

    oboToken = await exchangeIdPortenTokenForTokenXOboToken(
      idPortenToken,
      targetApi,
    );
  } catch (error) {
    return {
      error: error as FetchResultError,
    };
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
  } else {
    // Ok response
    return { error: null };
  }
}

/**
 * Makes "POST", "PUT" or "DELETE" request to backend with TokenX OBO token.
 * Expects a response body which is validated with the provided zod schema.
 * The returned FetchUpdateResult will contain an error object if something
 * goes wrong, and otherwise the validated response data.
 */
export async function tokenXFetchUpdateWithResponse<S extends z.ZodType>({
  targetApi,
  endpoint,
  requestBody,
  method = "POST",
  responseDataSchema,
}: {
  targetApi: TokenXTargetApi;
  endpoint: string;
  requestBody?: unknown;
  method?: "POST" | "PUT" | "DELETE";
  responseDataSchema: S;
}): Promise<FetchUpdateResultWithResponse<z.infer<S>>> {
  let oboToken: string;
  try {
    const idPortenToken = await validateAndGetIdPortenToken();

    oboToken = await exchangeIdPortenTokenForTokenXOboToken(
      idPortenToken,
      targetApi,
    );
  } catch (error) {
    return {
      error: error as FetchResultError,
      data: null,
    };
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

    return { error: errorResult, data: null };
  }

  if (!response.ok) {
    const errorResult = await getAndLogErrorResultFromNonOkResponse({
      response,
      endpoint,
      method,
    });

    return { error: errorResult, data: null };
  } else {
    // Valididate response data
    const { success, validatedData } = await validateResponseBody({
      response,
      responseDataSchema,
      endpoint,
      method,
    });

    if (success) {
      return { error: null, data: validatedData };
    } else {
      return {
        error: {
          type: FrontendErrorType.OK_RESPONSE_BUT_RESPONSE_BODY_INVALID,
        },
        data: null,
      };
    }
  }
}
