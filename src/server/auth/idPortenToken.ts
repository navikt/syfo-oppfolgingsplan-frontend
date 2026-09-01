import "server-only";
import { getToken, validateIdportenToken } from "@navikt/oasis";
import { headers } from "next/headers";
import { cache } from "react";
import { IdPortenTokenValidationError } from "./authError";
import { redirectToLogin } from "./redirectToLogin";

/**
 * Redirects users to login if validation is unsuccessful.
 * Used in GET requests to backend, which are done on page load / navigation.
 */
export const validateAndGetIdPortenTokenOrRedirectToLogin = async (
  redirectAfterLoginUrl: string,
): Promise<string> => {
  const validationResult = await validateIdPortenToken();

  if (validationResult.success) {
    return validationResult.token;
  }

  switch (validationResult.reason) {
    case TokenValidationFailureReason.MISSING_TOKEN:
    case TokenValidationFailureReason.INVALID_TOKEN:
      return redirectToLogin(redirectAfterLoginUrl);
    case TokenValidationFailureReason.VALIDATION_ERROR:
      throw new IdPortenTokenValidationError();
    default:
      return assertNeverTokenValidationReason(validationResult.reason);
  }
};

/**
 * Throws error if token validation is unsuccessful.
 * Used in update requests to backend. Not redirecting to login on invalid token,
 * to not interrupt the user too much in the middle of some action.
 */
export const validateAndGetIdPortenToken = async (): Promise<string> => {
  const validationResult = await validateIdPortenToken();

  if (!validationResult.success) {
    throw new IdPortenTokenValidationError();
  }

  return validationResult.token;
};

export const TokenValidationFailureReason = {
  MISSING_TOKEN: "MISSING_TOKEN",
  INVALID_TOKEN: "INVALID_TOKEN",
  VALIDATION_ERROR: "VALIDATION_ERROR",
} as const;

export type TokenValidationFailureReason =
  (typeof TokenValidationFailureReason)[keyof typeof TokenValidationFailureReason];

export type TokenValidationResult =
  | { success: true; token: string }
  | { success: false; reason: TokenValidationFailureReason };

export const validateIdPortenToken = cache(
  async (): Promise<TokenValidationResult> => {
    let idportenToken: string | null | undefined;
    try {
      const headersList = await headers();
      idportenToken = getToken(headersList);
    } catch {
      return {
        success: false,
        reason: TokenValidationFailureReason.VALIDATION_ERROR,
      };
    }

    if (!idportenToken) {
      return {
        success: false,
        reason: TokenValidationFailureReason.MISSING_TOKEN,
      };
    }

    let validationResult: Awaited<ReturnType<typeof validateIdportenToken>>;
    try {
      validationResult = await validateIdportenToken(idportenToken);
    } catch {
      return {
        success: false,
        reason: TokenValidationFailureReason.VALIDATION_ERROR,
      };
    }

    if (!validationResult.ok) {
      return {
        success: false,
        reason: TokenValidationFailureReason.INVALID_TOKEN,
      };
    }

    return { success: true, token: idportenToken };
  },
);

function assertNeverTokenValidationReason(_reason: never): never {
  throw new IdPortenTokenValidationError();
}
