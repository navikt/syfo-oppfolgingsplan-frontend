import { logger } from "@navikt/next-logger";
import { FrontendErrorType } from "../actions/FrontendErrorTypeEnum";
import type { FetchResultError } from "../tokenXFetch/FetchResult";

export function logWarningMessageAndThrowAuthError(logMessage: string): never {
  logger.warn(logMessage);
  throw {
    type: FrontendErrorType.AUTHENTICATION_ERROR,
  } as FetchResultError;
}
