// TypeScript
"use server";

import { nanoid } from "nanoid";
import { requestOboToken } from "@navikt/oasis";
import { logger } from "@navikt/next-logger";
import { z } from "zod";
import { FetchResult } from "@/server/FetchResult";
import { validateIdPortenToken } from "@/auth/validateIdPortenToken";

export async function authenticatedFetch<
  TResponseData,
  TRequestBody = unknown,
>({
  endpoint,
  clientId,
  method = "GET",
  body,
  schema,
  debug = false,
}: {
  endpoint: string;
  clientId: string;
  method?: "GET" | "POST" | "PUT" | "DELETE";
  body?: TRequestBody;
  schema?: z.ZodType<TResponseData>;
  debug?: boolean;
}): Promise<FetchResult<TResponseData>> {
  const callId = nanoid();
  const logDebug = (msg: string, extra?: unknown) =>
    debug &&
    logger.info(
      `[authenticatedFetch][${callId}] ${msg}${extra ? " " + JSON.stringify(extra).slice(0, 2000) : ""}`,
    );

  try {
    logDebug("Start", { endpoint, method });

    const tokenValidationResult = await validateIdPortenToken();
    if (!tokenValidationResult.success) {
      logger.warn(
        `[authenticatedFetch][${callId}] Unauthorized: ${tokenValidationResult.reason}`,
      );
      return {
        success: false,
        errorType: "UNAUTHORIZED",
        errorMessage: tokenValidationResult.reason,
      };
    }

    const tokenxGrant = await requestOboToken(
      tokenValidationResult.token,
      clientId,
    );

    if (!tokenxGrant.ok) {
      const error = `Failed to exchange idporten token: ${tokenxGrant.error}`;
      logger.error(`[authenticatedFetch][${callId}] ${error}`);
      return { success: false, errorType: "FAILED_GRANT", errorMessage: error };
    }

    const hasBody = body !== undefined && method !== "GET";
    if (hasBody) {
      logDebug("Request body", body);
    }

    const response = await fetch(endpoint, {
      method,
      credentials: "include",
      headers: {
        Authorization: `Bearer ${tokenxGrant.token}`,
        "Nav-Consumer-Id": "syfo-oppfolgingsplan-frontend",
        "Nav-Call-Id": callId,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      ...(hasBody ? { body: JSON.stringify(body) } : {}),
    }).catch((e) => {
      throw new Error(`Network/Fetch layer failed: ${(e as Error).message}`);
    });

    logDebug("Response status", { status: response.status, ok: response.ok });

    if (!response.ok) {
      let errorBody: string | undefined;
      try {
        errorBody = await response.text();
      } catch {
        errorBody = "<unable to read body>";
      }
      const error = `Failed to fetch data from ${endpoint}: ${response.status} ${response.statusText}`;
      logger.error(
        `[authenticatedFetch][${callId}] ${error}. Body: ${errorBody?.slice(0, 2000)}`,
      );
      return { success: false, errorType: "FETCH_FAILED", errorMessage: error };
    }

    // Try parse JSON; if empty 204 etc.
    let data: unknown = null;
    const text = await response.text();
    if (text) {
      try {
        data = JSON.parse(text);
      } catch (e) {
        const parseErr = `Invalid JSON in response: ${(e as Error).message}`;
        logger.error(`[authenticatedFetch][${callId}] ${parseErr}`);
        return {
          success: false,
          errorType: "SCHEMA_PARSING_FAILED",
          errorMessage: parseErr,
        };
      }
    }

    if (schema) {
      const parsed = schema.safeParse(data);
      if (!parsed.success) {
        const error = "Failed to parse result! " + parsed.error;
        logger.error(`[authenticatedFetch][${callId}] ${error}`);
        return {
          success: false,
          errorType: "SCHEMA_PARSING_FAILED",
          errorMessage: error,
        };
      }
      logDebug("Parsed data ok");
      return { success: true, data: parsed.data };
    }

    logDebug("Data (unvalidated)", data);
    return { success: true, data: data as TResponseData };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    logger.error(
      `[authenticatedFetch][${callId}] Unexpected error: ${message}`,
    );
    return {
      success: false,
      errorType: "UNEXPECTED_ERROR",
      errorMessage: message,
    };
  }
}
