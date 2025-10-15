"use server";

import { nanoid } from "nanoid";
import { requestOboToken } from "@navikt/oasis";
import { logger } from "@navikt/next-logger";
import { z } from "zod";
import { FetchResult } from "@/server/FetchResult";
import { validateIdPortenToken } from "@/auth/validateIdPortenToken";

export async function authenticatedFetchOld<
  TResponseData,
  TRequestBody = unknown,
>({
  endpoint,
  clientId,
  method = "GET",
  body,
  schema,
}: {
  endpoint: string;
  clientId: string;
  method?: "GET" | "POST" | "PUT" | "DELETE";
  body?: TRequestBody;
  schema?: z.ZodType<TResponseData>;
}): Promise<FetchResult<TResponseData>> {
  try {
    const tokenValidationResult = await validateIdPortenToken();
    if (!tokenValidationResult.success) {
      return {
        success: false,
        errorType: "UNAUTHORIZED",
        errorMessage: tokenValidationResult.reason,
      };
    }

    const tokenxGrant = await requestOboToken(
      tokenValidationResult.token,
      clientId
    );

    if (!tokenxGrant.ok) {
      const error = `Failed to exchange idporten token: ${tokenxGrant.error}`;
      logger.error(error);
      return { success: false, errorType: "FAILED_GRANT", errorMessage: error };
    }

    const response = await fetch(endpoint, {
      method,
      headers: {
        Authorization: `Bearer ${tokenxGrant.token}`,
        "Nav-Consumer-Id": "syfo-oppfolgingsplan-frontend",
        "Nav-Call-Id": nanoid(),
        "Content-Type": "application/json",
      },
      ...(body ? { body: JSON.stringify(body) } : {}),
    });

    if (!response.ok) {
      const error = `Failed to fetch data from ${endpoint}: ${response.statusText}`;
      logger.error(error);
      return { success: false, errorType: "FETCH_FAILED", errorMessage: error };
    }

    const data = await response.json();

    if (schema) {
      const parsed = schema.safeParse(data);
      if (!parsed.success) {
        const error = "Failed to parse result! " + parsed.error;
        logger.error(error);
        return {
          success: false,
          errorType: "SCHEMA_PARSING_FAILED",
          errorMessage: error,
        };
      }
      return { success: true, data: parsed.data };
    }

    return { success: true, data: data as TResponseData };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    logger.error(`Unexpected error in authenticatedFetch: ${message}`);
    return {
      success: false,
      errorType: "UNEXPECTED_ERROR",
      errorMessage: message,
    };
  }
}
