import { logger } from "@navikt/next-logger";
import { FrontendErrorType } from "@/server/actions/FrontendErrorTypeEnum";
import { FetchResultError } from "@/server/tokenXFetch/FetchResult";
import {
  ActionError,
  BackendErrorType,
  DelPlanMedLegeErrorType,
} from "../common/types/errors";

const ERROR_DEL_PLAN_MED_LEGE =
  `Du får dessverre ikke delt denne planen med legen herfra. Det kan hende at den ansatte ikke har en fastlege, ` +
  `eller at fastlegen ikke kan ta imot elektroniske meldinger. I dette tilfellet må dere laste ned og skrive ut ` +
  `planen slik at dere får delt den med legen manuelt.`;

function isUnknownErrorType(type: string): boolean {
  const isBackendError = Object.values(BackendErrorType).includes(
    type as BackendErrorType,
  );
  const isFrontendError = Object.values(FrontendErrorType).includes(
    type as FrontendErrorType,
  );
  return !isBackendError && !isFrontendError;
}

export function getGeneralActionErrorMessage(
  error: ActionError,
  fallbackMessage: string,
): string {
  if (error.type === BackendErrorType.AUTHENTICATION_ERROR) {
    return "Du har blitt logget ut. Vennligst logg inn igjen.";
  }
  if (error.type === BackendErrorType.AUTHORIZATION_ERROR) {
    return "Du har ikke tilgang til å utføre denne handlingen.";
  }

  if (isUnknownErrorType(error.type)) {
    logger.warn(`Unhandled error type: ${error.type}`);
  }

  return fallbackMessage;
}

export function getDelPlanMedLegeErrorMessage(
  error: FetchResultError<DelPlanMedLegeErrorType>,
): string {
  if (error.type === BackendErrorType.LEGE_NOT_FOUND) {
    return ERROR_DEL_PLAN_MED_LEGE;
  }

  return getGeneralActionErrorMessage(
    error,
    "Vi har problem med å dele planen med fastlegen akkurat nå. Vennligst prøv igjen senere.",
  );
}
