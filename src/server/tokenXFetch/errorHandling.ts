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
  logger.error(
    `Unexpected network error on fetch to ${method} ${endpoint}: errorName=${errorName} message=${message}`,
  );

  return {
    type: FrontendErrorType.FETCH_NETWORK_ERROR,
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

    logger.error(
      `Got unknown error response from fetch to ${method} ${endpoint} (status=${response.status} ${response.statusText}): ${bodySnippet ? ` body=${bodySnippet}` : ""}`,
    );

    return {
      type: FrontendErrorType.FETCH_UNKOWN_ERROR_RESPONSE,
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
