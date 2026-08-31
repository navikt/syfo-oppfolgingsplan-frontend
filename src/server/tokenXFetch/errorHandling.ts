import { logger } from "@navikt/next-logger";
import type { RuntimeErrorEvent } from "@/common/runtimeErrorEvent";
import type { CombinedErrorType } from "@/schema/errorSchemas";
import { FrontendErrorType } from "../actions/FrontendErrorTypeEnum";
import { type FetchResultError, fetchResultErrorSchema } from "./FetchResult";

const EXPECTED_ERROR_TYPES: ReadonlySet<CombinedErrorType> = new Set([
  "LEGE_NOT_FOUND",
]);

export function getAndLogFetchNetworkError({
  error,
  eventType,
  method,
}: {
  error: unknown;
  eventType: RuntimeErrorEvent;
  method: string;
}): FetchResultError {
  const errorType = FrontendErrorType.FETCH_NETWORK_ERROR;

  logger.error(
    {
      event_type: eventType,
      error_code: errorType,
      exception_type: getSafeExceptionType(error),
      method,
    },
    "TokenX fetch failed before receiving a response",
  );

  return {
    type: errorType,
  };
}

export async function getAndLogErrorResultFromNonOkResponse({
  eventType,
  response,
  method,
}: {
  eventType: RuntimeErrorEvent;
  response: Response;
  method: string;
}): Promise<FetchResultError> {
  try {
    const errorResponseJson = await response.clone().json();
    const parsedErrorResponse = fetchResultErrorSchema.parse(errorResponseJson);

    const logMessage = "TokenX fetch returned a non-OK response";
    const logMetadata = {
      event_type: eventType,
      error_code: parsedErrorResponse.type,
      status: response.status,
      method,
    };

    if (EXPECTED_ERROR_TYPES.has(parsedErrorResponse.type)) {
      logger.info(logMetadata, logMessage);
    } else {
      logger.error(logMetadata, logMessage);
    }

    return parsedErrorResponse;
  } catch {
    const errorType = FrontendErrorType.FETCH_UNKOWN_ERROR_RESPONSE;

    logger.error(
      {
        event_type: eventType,
        error_code: errorType,
        status: response.status,
        method,
      },
      "TokenX fetch returned a non-OK response with an invalid error body",
    );

    return {
      type: errorType,
    };
  }
}

function getSafeExceptionType(error: unknown): string {
  if (!(error instanceof Error)) return "UnknownError";

  try {
    switch (error.name) {
      case "AbortError":
      case "DOMException":
        return "DOMException";
      case "TypeError":
      case "RangeError":
      case "ReferenceError":
      case "SyntaxError":
      case "URIError":
      case "EvalError":
        return error.name;
      default:
        return "Error";
    }
  } catch {
    return "Error";
  }
}
