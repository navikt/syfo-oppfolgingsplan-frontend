import { logger } from "@navikt/next-logger";
import {
  CombinedErrorType,
  combinedErrorTypeSchema,
} from "@/schema/errorSchemas";
import { FetchResultError } from "@/server/tokenXFetch/FetchResult";

const GENERIC_ERROR_MESSAGE =
  "Beklager, noe gikk galt. Vennligst prøv igjen senere.";

const errorMessages: Record<CombinedErrorType, string> = {
  // Auth errors
  AUTHENTICATION_ERROR: "Du har blitt logget ut. Vennligst logg inn igjen.",
  AUTHORIZATION_ERROR: "Du har ikke tilgang til å utføre denne handlingen.",

  // Backend errors
  NOT_FOUND: GENERIC_ERROR_MESSAGE,
  INTERNAL_SERVER_ERROR: GENERIC_ERROR_MESSAGE,
  ILLEGAL_ARGUMENT: GENERIC_ERROR_MESSAGE,
  BAD_REQUEST: GENERIC_ERROR_MESSAGE,
  CONFLICT: GENERIC_ERROR_MESSAGE,
  LEGE_NOT_FOUND:
    "Du får dessverre ikke delt denne planen med legen herfra. Det kan hende at den ansatte ikke har en fastlege, " +
    "eller at fastlegen ikke kan ta imot elektroniske meldinger. I dette tilfellet må dere laste ned og skrive ut " +
    "planen slik at dere får delt den med legen manuelt.",
  PLAN_NOT_FOUND: GENERIC_ERROR_MESSAGE,
  SYKMELDT_NOT_FOUND: GENERIC_ERROR_MESSAGE,

  // Frontend errors
  OK_RESPONSE_BUT_RESPONSE_BODY_INVALID: GENERIC_ERROR_MESSAGE,
  SERVER_ACTION_INPUT_VALIDATION_ERROR: GENERIC_ERROR_MESSAGE,
  FETCH_UNKOWN_ERROR_RESPONSE: GENERIC_ERROR_MESSAGE,
  FETCH_NETWORK_ERROR:
    "Vi fikk ikke kontakt med tjenesten. Sjekk nettverket ditt og prøv igjen.",
};

/**
 * Get a user-friendly error message for a FetchResultError.
 *
 * @example
 * getFetchResultErrorMessage(error)
 */
export function getFetchResultErrorMessage(error: FetchResultError): string {
  if (!error?.type) {
    logger.warn("getFetchResultErrorMessage called with missing error or type");
    return GENERIC_ERROR_MESSAGE;
  }

  const parsed = combinedErrorTypeSchema.safeParse(error.type);

  if (!parsed.success) {
    logger.warn(`Unhandled error type: ${error.type}`);
    return GENERIC_ERROR_MESSAGE;
  }

  return errorMessages[parsed.data];
}
