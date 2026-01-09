import { logger } from "@navikt/next-logger";
import {
  CombinedErrorType,
  combinedErrorTypeSchema,
} from "@/schema/errorSchemas";
import { FetchResultError } from "@/server/tokenXFetch/FetchResult";

const DEFAULT_GENERAL_MESSAGE =
  "Beklager, noe gikk galt. Vennligst prøv igjen senere.";

// Mapping of error types to specific user messages.
// If the value is `null`, it means this error type is considered "general"
// and should use the default general message (or a custom override provided by the caller).
const standardErrorMessages: Record<CombinedErrorType, string | null> = {
  // Auth errors
  AUTHENTICATION_ERROR: "Du har blitt logget ut. Vennligst logg inn igjen.",
  AUTHORIZATION_ERROR: "Du har ikke tilgang til å utføre denne handlingen.",

  // Backend errors
  NOT_FOUND: null,
  INTERNAL_SERVER_ERROR: null,
  ILLEGAL_ARGUMENT: null,
  BAD_REQUEST: null,
  CONFLICT: null,
  PLAN_NOT_FOUND: null,

  // Backend errors with a specific message
  SYKMELDT_NOT_FOUND:
    "Vi finner ikke den ansatte. Dette kan skyldes at vedkommende ikke har vært sykmeldt de siste 4 månedene, eller at du ikke har tilgang til personen.",

  // Specific Backend errors
  LEGE_NOT_FOUND:
    "Du får dessverre ikke delt denne planen med legen herfra. Det kan hende at den ansatte ikke har en fastlege, " +
    "eller at fastlegen ikke kan ta imot elektroniske meldinger. I dette tilfellet må dere laste ned og skrive ut " +
    "planen slik at dere får delt den med legen manuelt.",

  // Frontend errors
  OK_RESPONSE_BUT_RESPONSE_BODY_INVALID: null,
  SERVER_ACTION_INPUT_VALIDATION_ERROR: null,
  FETCH_UNKOWN_ERROR_RESPONSE: null,
  FETCH_NETWORK_ERROR:
    "Vi fikk ikke kontakt med tjenesten. Sjekk nettverket ditt og prøv igjen.",
};

/**
 * Resolves the correct user-facing error message for a given FetchResultError.
 *
 * @param error - The error object returned from the fetch operation.
 * @param customGeneralMessage - (Optional) A custom message to display ONLY when the error is of a general type
 *                               (e.g. INTERNAL_SERVER_ERROR, NOT_FOUND).
 *                               If the error has a specific mandatory message (e.g. LEGE_NOT_FOUND),
 *                               this custom message will be ignored.
 * @returns The resolved error message string.
 */
export function getFetchResultErrorMessage(
  error: FetchResultError,
  customGeneralMessage?: string,
): string {
  const generalErrorMessage = customGeneralMessage || DEFAULT_GENERAL_MESSAGE;

  if (!error?.type) {
    logger.warn("getFetchResultErrorMessage called with missing error or type");
    return generalErrorMessage;
  }

  const parsed = combinedErrorTypeSchema.safeParse(error.type);

  if (!parsed.success) {
    logger.warn(`Unhandled error type: ${error.type}`);
    return generalErrorMessage;
  }

  const errorType = parsed.data;
  const specificMessage = standardErrorMessages[errorType];

  return specificMessage ?? generalErrorMessage;
}
