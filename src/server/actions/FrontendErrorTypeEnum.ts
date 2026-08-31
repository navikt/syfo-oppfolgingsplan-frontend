/** Error types for errors originating from this frontend app. (As opposed to
 * originating from syfo-oppfolgingsplan-backend.)
) */
export enum FrontendErrorType {
  AUTHENTICATION_ERROR = "AUTHENTICATION_ERROR",
  OK_RESPONSE_BUT_RESPONSE_BODY_INVALID = "OK_RESPONSE_BUT_RESPONSE_BODY_INVALID",
  /** When validation of input to a server action fails. */
  SERVER_ACTION_INPUT_VALIDATION_ERROR = "SERVER_ACTION_INPUT_VALIDATION_ERROR",
  /** When a fetch call returns a non-ok response with an unrecognized error response body. */
  FETCH_UNKNOWN_ERROR_RESPONSE = "FETCH_UNKNOWN_ERROR_RESPONSE",
  /** @deprecated Source-compatible alias. Legacy wire values are still accepted by the schema. */
  FETCH_UNKOWN_ERROR_RESPONSE = "FETCH_UNKNOWN_ERROR_RESPONSE",
  /** When a fetch call throws an error. It could be due to a network error or malformed request. */
  FETCH_NETWORK_ERROR = "FETCH_NETWORK_ERROR",
}
