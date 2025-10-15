import "server-only";

import { cache } from "react";
import z from "zod";
import { logger } from "@navikt/next-logger";
import { requestOboToken } from "@navikt/oasis";
import { validateIdPortenToken } from "@/auth/validateIdPortenToken";
import {
  redirectToLoginForAG,
  redirectToLoginForSM,
} from "@/auth/redirectToLogin";
import {
  audienceClientIdMap,
  getBackendRequestHeaders,
  TokenXAudience,
} from "./fetchData/helpers";

/**
 * Redirects users to login if validation is unsuccessful.
 * narmesteLederId is needed to provide correct redirect URL for AG users.
 */
const validateAndGetIdPortenTokenOrRedirectForAG = async (
  narmesteLederId: string
) => {
  const validationResult = await validateIdPortenToken();

  if (!validationResult.success) {
    return redirectToLoginForAG(narmesteLederId);
  }

  return validationResult.token;
};

/**
 * Redirects users to login if validation is unsuccessful.
 */
const validateAndGetIdPortenTokenOrRedirectForSM = async () => {
  const validationResult = await validateIdPortenToken();

  if (!validationResult.success) {
    return redirectToLoginForSM();
  }

  return validationResult.token;
};

/**
 * Throws error if validation is unsuccessful.
 */
const validateAndGetIdPortenToken = async () => {
  const validationResult = await validateIdPortenToken();

  if (!validationResult.success) {
    const errorMessage = `IdPorten token validation failed: ${validationResult.reason}`;
    logErrorMessageAndThrowError(errorMessage);
  }

  return validationResult.token;
};

const exchangeIdPortenTokenForTokenXOboToken = cache(
  async (idPortenToken: string, audience: TokenXAudience) => {
    const tokenXGrant = await requestOboToken(
      idPortenToken,
      audienceClientIdMap[audience]
    );

    if (!tokenXGrant.ok) {
      const errorMessage = `Failed to exchange idporten token: ${tokenXGrant.error}`;
      logErrorMessageAndThrowError(errorMessage);
    }

    return tokenXGrant.token;
  }
);

function logErrorMessageAndThrowError(logMessage: string): never {
  logger.error(logMessage);
  throw new Error("Det oppstod en feil ved henting av data.");
}

async function logFailedFetchAndThrowError(
  response: Response,
  calledEnpoint: string,
  calledMethod: string = "GET"
): Promise<never> {
  let bodySnippet: string | undefined;
  try {
    const text = await response.text();
    bodySnippet = text.slice(0, 500);
  } catch {
    /* ignore */
  }

  const errorMessage = `Fetch failed: method=${calledMethod} endpoint=${calledEnpoint} status=${response.status} ${response.statusText}${bodySnippet ? ` body=${bodySnippet}` : ""}`;
  logErrorMessageAndThrowError(errorMessage);
}

export async function tokenXFetchGet<S extends z.ZodType>({
  audience,
  endpoint,
  responseDataSchema,
  narmesteLederIdIfAG,
}: {
  audience: TokenXAudience;
  endpoint: string;
  responseDataSchema: S;
  narmesteLederIdIfAG: string | false;
}): Promise<z.infer<S>> {
  const idPortenToken = narmesteLederIdIfAG
    ? await validateAndGetIdPortenTokenOrRedirectForAG(narmesteLederIdIfAG)
    : await validateAndGetIdPortenTokenOrRedirectForSM();

  const oboToken = await exchangeIdPortenTokenForTokenXOboToken(
    idPortenToken,
    audience
  );

  const response = await fetch(endpoint, {
    headers: getBackendRequestHeaders(oboToken),
  });

  if (!response.ok) {
    await logFailedFetchAndThrowError(response, endpoint);
  }

  let responseData: unknown;
  try {
    responseData = await response.json();
  } catch (err) {
    const errorMessage = `Failed to parse response as JSON from ${endpoint}: ${err}`;
    logErrorMessageAndThrowError(errorMessage);
  }

  try {
    return responseDataSchema.parse(responseData);
  } catch (err) {
    const errorMessage = `Failed to parse response data with zod schema from ${endpoint}: ${err}`;
    logErrorMessageAndThrowError(errorMessage);
  }
}

export async function tokenXFetchUpdate({
  audience,
  endpoint,
  requestBody,
  method = "POST",
}: {
  audience: TokenXAudience;
  endpoint: string;
  requestBody: unknown;
  method?: "POST" | "PUT" | "DELETE";
}) {
  const idPortenToken = await validateAndGetIdPortenToken();

  const oboToken = await exchangeIdPortenTokenForTokenXOboToken(
    idPortenToken,
    audience
  );

  const response = await fetch(endpoint, {
    method,
    body: JSON.stringify(requestBody),
    headers: getBackendRequestHeaders(oboToken),
  });

  if (!response.ok) {
    await logFailedFetchAndThrowError(response, endpoint, method);
  }

  return true;

  // TODO: vurdere om det er behov for å ta imot data
}
