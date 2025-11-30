import "server-only";
import { cache } from "react";
import { headers } from "next/headers";
import { logger } from "@navikt/next-logger";
import { getToken, validateIdportenToken } from "@navikt/oasis";
import { logWarningMessageAndThrowAuthError } from "./handleAuthError";
import { redirectToLogin } from "./redirectToLogin";

/**
 * Redirects users to login if validation is unsuccessful.
 * Used in GET requests to backend, which are done on page load / navigation.
 */
export const validateAndGetIdPortenTokenOrRedirectToLogin = async (
  redirectAfterLoginUrl: string,
) => {
  const validationResult = await validateIdPortenToken();

  if (!validationResult.success) {
    return redirectToLogin(redirectAfterLoginUrl);
  }

  return validationResult.token;
};

/**
 * Throws error if token validation is unsuccessful.
 * Used in update requests to backend. Not redirecting to login on invalid token,
 * to not interrupt the user too much in the middle of some action.
 */
export const validateAndGetIdPortenToken = async () => {
  const validationResult = await validateIdPortenToken();

  if (!validationResult.success) {
    const errorMessage = `IdPorten token validation failed: ${validationResult.reason}`;
    logWarningMessageAndThrowAuthError(errorMessage);
  }

  return validationResult.token;
};

export type TokenValidationResult =
  | { success: true; token: string }
  | { success: false; reason: string };

export const validateIdPortenToken = cache(
  async (): Promise<TokenValidationResult> => {
    const headersList = await headers();
    const idportenToken = getToken(headersList);

    if (!idportenToken) {
      const error = "Missing idporten token";
      logger.warn(error);
      return { success: false, reason: error };
    }

    const validationResult = await validateIdportenToken(idportenToken);
    if (!validationResult.ok) {
      const error = `Invalid JWT token found, cause: ${validationResult.errorType} ${validationResult.error}`;
      logger.warn(error);
      return { success: false, reason: error };
    }

    return { success: true, token: idportenToken };
  },
);
