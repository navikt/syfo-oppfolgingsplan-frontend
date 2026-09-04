import "server-only";
import type z from "zod";
import type { RuntimeErrorEvent } from "@/common/runtimeErrorEvent";
import { FrontendErrorType } from "../actions/FrontendErrorTypeEnum";
import { validateAndGetIdPortenToken } from "../auth/idPortenToken";
import {
  exchangeIdPortenTokenForTokenXOboToken,
  type TokenXTargetApi,
} from "../auth/tokenXExchange";
import {
  getAndLogAuthenticationErrorResult,
  getAndLogErrorResultFromNonOkResponse,
  getAndLogFetchNetworkError,
} from "./errorHandling";
import type {
  FetchUpdateResult,
  FetchUpdateResultWithResponse,
} from "./FetchResult";
import { getBackendRequestHeaders } from "./helpers";
import { validateResponseBody } from "./validateResponseBody";

/**
 * Makes "POST", "PUT" or "DELETE" request to backend with TokenX OBO token.
 * Expects and returns no response body.
 * The returned FetchUpdateResult will contain an error object if
 * something goes wrong.
 */
export async function tokenXFetchUpdate({
  eventType,
  targetApi,
  endpoint,
  requestBody,
  method = "POST",
  signal,
}: {
  eventType: RuntimeErrorEvent;
  targetApi: TokenXTargetApi;
  endpoint: string;
  requestBody?: unknown;
  method?: "POST" | "PUT" | "DELETE";
  signal?: AbortSignal;
}): Promise<FetchUpdateResult> {
  let oboToken: string;
  try {
    const idPortenToken = await validateAndGetIdPortenToken();

    oboToken = await exchangeIdPortenTokenForTokenXOboToken(
      idPortenToken,
      targetApi,
    );
  } catch (error) {
    const errorResult = getAndLogAuthenticationErrorResult({
      error,
      eventType,
      method,
    });
    if (!errorResult) {
      throw error;
    }
    return {
      error: errorResult,
    };
  }

  let response: Response;
  try {
    response = await fetch(endpoint, {
      method,
      body: requestBody ? JSON.stringify(requestBody) : undefined,
      headers: getBackendRequestHeaders(oboToken),
      signal,
    });
  } catch (error) {
    const errorResult = getAndLogFetchNetworkError({
      error,
      eventType,
      method,
    });

    return { error: errorResult };
  }

  if (!response.ok) {
    const errorResult = await getAndLogErrorResultFromNonOkResponse({
      eventType,
      response,
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
  eventType,
  targetApi,
  endpoint,
  requestBody,
  method = "POST",
  responseDataSchema,
  signal,
}: {
  eventType: RuntimeErrorEvent;
  targetApi: TokenXTargetApi;
  endpoint: string;
  requestBody?: unknown;
  method?: "POST" | "PUT" | "DELETE";
  responseDataSchema: S;
  signal?: AbortSignal;
}): Promise<FetchUpdateResultWithResponse<z.infer<S>>> {
  let oboToken: string;
  try {
    const idPortenToken = await validateAndGetIdPortenToken();

    oboToken = await exchangeIdPortenTokenForTokenXOboToken(
      idPortenToken,
      targetApi,
    );
  } catch (error) {
    const errorResult = getAndLogAuthenticationErrorResult({
      error,
      eventType,
      method,
    });
    if (!errorResult) {
      throw error;
    }
    return {
      error: errorResult,
      data: null,
    };
  }

  let response: Response;
  try {
    response = await fetch(endpoint, {
      method,
      body: requestBody ? JSON.stringify(requestBody) : undefined,
      headers: getBackendRequestHeaders(oboToken),
      signal,
    });
  } catch (error) {
    const errorResult = getAndLogFetchNetworkError({
      error,
      eventType,
      method,
    });

    return { error: errorResult, data: null };
  }

  if (!response.ok) {
    const errorResult = await getAndLogErrorResultFromNonOkResponse({
      eventType,
      response,
      method,
    });

    return { error: errorResult, data: null };
  } else {
    // Valididate response data
    const { success, validatedData } = await validateResponseBody({
      eventType,
      response,
      responseDataSchema,
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
