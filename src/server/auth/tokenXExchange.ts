import "server-only";
import { cache } from "react";
import { requestOboToken } from "@navikt/oasis";
import { getServerEnv } from "@/env-variables/serverEnv";
import { logWarningMessageAndThrowAuthError } from "./handleAuthError";

export enum TokenXTargetApi {
  SYFO_OPPFOLGINGSPLAN_BACKEND = "SYFO_OPPFOLGINGSPLAN_BACKEND",
  DINE_SYKMELDTE_BACKEND = "DINE_SYKMELDTE_BACKEND",
  LUMI_API = "LUMI_API",
}

/**
 * Some functions are cached with cache function to avoid multiple calls for the
 * same arguments during a single next "render pass". During a render pass (a
 * page load or navigation), the set of server components being rendered might
 * make multiple calls to these functions (via mulitple tokenXFetchGet calls).
 */

/**
 * Throws an error if token exchange is unsuccessful.
 * */
export const exchangeIdPortenTokenForTokenXOboToken = cache(
  async (idPortenToken: string, targetApi: TokenXTargetApi) => {
    const tokenXGrant = await requestOboToken(
      idPortenToken,
      getClientIdForTokenXTargetApi(targetApi),
    );

    if (!tokenXGrant.ok) {
      const errorMessage = `Failed to exchange idporten token: ${tokenXGrant.error}`;
      logWarningMessageAndThrowAuthError(errorMessage);
    }

    return tokenXGrant.token;
  },
);

function getClientIdForTokenXTargetApi(targetApi: TokenXTargetApi): string {
  if (targetApi === TokenXTargetApi.SYFO_OPPFOLGINGSPLAN_BACKEND) {
    return getServerEnv().SYFO_OPPFOLGINGSPLAN_BACKEND_CLIENT_ID;
  } else if (targetApi === TokenXTargetApi.DINE_SYKMELDTE_BACKEND) {
    return getServerEnv().DINESYKMELDTE_BACKEND_CLIENT_ID;
  } else if (targetApi === TokenXTargetApi.LUMI_API) {
    return getServerEnv().LUMI_API_CLIENT_ID;
  } else {
    return "" as never;
  }
}
