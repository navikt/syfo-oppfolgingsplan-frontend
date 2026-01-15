import { logger } from "@navikt/next-logger";
import { FrontendErrorType } from "../actions/FrontendErrorTypeEnum";
import { FetchResultError, fetchResultErrorSchema } from "./FetchResult";

export function getAndLogFetchNetworkError({
  error,
  endpoint,
  method,
}: {
  error: unknown;
  endpoint: string;
  method: string;
}): FetchResultError {
  const { errorName, message } = tryToExtractNameAndMessageFromError(error);
  const errorType = FrontendErrorType.FETCH_NETWORK_ERROR;

  logger.error(
    { type: errorType, method, endpoint },
    `Unexpected network error on fetch to ${method} ${endpoint}: errorName=${errorName} message=${message}`,
  );

  return {
    type: errorType,
  };
}

export async function getAndLogErrorResultFromNonOkResponse({
  response,
  endpoint,
  method,
}: {
  response: Response;
  endpoint: string;
  method: string;
}): Promise<FetchResultError> {
  try {
    const errorResponseJson = await response.json();
    const parsedErrorResponse = fetchResultErrorSchema.parse(errorResponseJson);

    logger.error(
      { ...parsedErrorResponse, method, endpoint },
      `Got structured error response from fetch to ${method} ${endpoint} (status=${response.status} ${response.statusText}): type=${parsedErrorResponse.type}${parsedErrorResponse.message ? ` message=${parsedErrorResponse.message}` : ""}`,
    );

    return parsedErrorResponse;
  } catch {
    let bodySnippet: string | undefined;
    try {
      const text = await response.text();
      bodySnippet = text.slice(0, 200);
    } catch {
      /* ignore response.text() error */
    }

    const errorType = FrontendErrorType.FETCH_UNKOWN_ERROR_RESPONSE;

    logger.error(
      { type: errorType, method, endpoint },
      `Got unknown error response from fetch to ${method} ${endpoint} (status=${response.status} ${response.statusText}): ${bodySnippet ? ` body=${bodySnippet}` : ""}`,
    );

    return {
      type: errorType,
    };
  }
}

export function tryToExtractNameAndMessageFromError(err: unknown) {
  const { name: errorName, message } =
    err instanceof Error
      ? err
      : {
          name: "Unknown",
          message: "Unknown",
        };
  return {
    errorName,
    message,
  };
}
