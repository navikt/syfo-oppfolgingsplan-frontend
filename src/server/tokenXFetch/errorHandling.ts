import { logger } from "@navikt/next-logger";
import {
  getRuntimeErrorOperation,
  RuntimeAuthenticationErrorCode,
  RuntimeErrorEvent,
  type RuntimeErrorEvent as RuntimeErrorEventType,
  type RuntimeErrorHttpMethod,
} from "@/common/runtimeErrorEvent";
import type { CombinedErrorType } from "@/schema/errorSchemas";
import { FrontendErrorType } from "../actions/FrontendErrorTypeEnum";
import {
  isIdPortenTokenValidationError,
  isTokenXExchangeError,
} from "../auth/authError";
import { type FetchResultError, fetchResultErrorSchema } from "./FetchResult";

/**
 * Expected domain outcomes are scoped to the operation where they are normal.
 * A matching HTTP/error code from another operation remains an operational
 * error instead of being silently downgraded globally.
 */
type ExpectedDomainOutcome = {
  eventType: RuntimeErrorEventType;
  errorType: CombinedErrorType;
  status: number;
};

const EXPECTED_DOMAIN_OUTCOMES = [
  {
    eventType:
      RuntimeErrorEvent.OPPFOLGINGSPLAN_ARBEIDSGIVER_OVERSIKT_FETCH_FAILED,
    errorType: "SYKMELDT_NOT_FOUND",
    status: 404,
  },
  {
    eventType: RuntimeErrorEvent.OPPFOLGINGSPLAN_DEL_MED_LEGE_FAILED,
    errorType: "LEGE_NOT_FOUND",
    status: 404,
  },
] as const satisfies readonly ExpectedDomainOutcome[];

export function getAndLogAuthenticationErrorResult({
  error,
  eventType,
  method,
}: {
  error: unknown;
  eventType: RuntimeErrorEventType;
  method: RuntimeErrorHttpMethod;
}): FetchResultError | null {
  let errorCode: RuntimeAuthenticationErrorCode;
  if (isIdPortenTokenValidationError(error)) {
    errorCode = RuntimeAuthenticationErrorCode.TOKEN_VALIDATION_FAILED;
  } else if (isTokenXExchangeError(error)) {
    errorCode = RuntimeAuthenticationErrorCode.TOKEN_EXCHANGE_FAILED;
  } else {
    return null;
  }

  logger.error(
    {
      event_type: eventType,
      operation: getRuntimeErrorOperation(eventType),
      error_code: errorCode,
      method,
    },
    "TokenX authentication failed",
  );

  return {
    type: FrontendErrorType.AUTHENTICATION_ERROR,
  };
}

export function getAndLogFetchNetworkError({
  error,
  eventType,
  method,
}: {
  error: unknown;
  eventType: RuntimeErrorEventType;
  method: RuntimeErrorHttpMethod;
}): FetchResultError {
  const errorType = FrontendErrorType.FETCH_NETWORK_ERROR;

  logger.error(
    {
      event_type: eventType,
      operation: getRuntimeErrorOperation(eventType),
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
  eventType: RuntimeErrorEventType;
  response: Response;
  method: RuntimeErrorHttpMethod;
}): Promise<FetchResultError> {
  try {
    const errorResponseJson = await response.clone().json();
    const parsedErrorResponse = fetchResultErrorSchema.parse(errorResponseJson);

    const logMessage = "TokenX fetch returned a non-OK response";
    const logMetadata = {
      event_type: eventType,
      operation: getRuntimeErrorOperation(eventType),
      error_code: parsedErrorResponse.type,
      upstream_status: response.status,
      method,
    };

    if (
      isExpectedDomainOutcome(
        eventType,
        parsedErrorResponse.type,
        response.status,
      )
    ) {
      logger.info(logMetadata, logMessage);
    } else {
      logger.error(logMetadata, logMessage);
    }

    return parsedErrorResponse;
  } catch {
    const errorType = FrontendErrorType.FETCH_UNKNOWN_ERROR_RESPONSE;

    logger.error(
      {
        event_type: eventType,
        operation: getRuntimeErrorOperation(eventType),
        error_code: errorType,
        upstream_status: response.status,
        method,
      },
      "TokenX fetch returned a non-OK response with an invalid error body",
    );

    return {
      type: errorType,
    };
  }
}

function isExpectedDomainOutcome(
  eventType: RuntimeErrorEventType,
  errorType: CombinedErrorType,
  status: number,
): boolean {
  return EXPECTED_DOMAIN_OUTCOMES.some(
    (outcome) =>
      outcome.eventType === eventType &&
      outcome.errorType === errorType &&
      outcome.status === status,
  );
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
