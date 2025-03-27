"use server";

import { nanoid } from "nanoid";
import { requestOboToken } from "@navikt/oasis";
import { logger } from "@navikt/next-logger";
import { z } from "zod";

export type FetchResult<T> =
  | { success: true; data: T }
  | { success: false; error: string };

export async function authenticatedFetch<
  TResponseData,
  TRequestBody = unknown,
>({
  endpoint,
  clientId,
  idportenToken,
  method = "GET",
  body,
  schema,
}: {
  endpoint: string;
  clientId: string;
  idportenToken: string;
  method?: "GET" | "POST" | "PUT" | "DELETE";
  body?: TRequestBody;
  schema?: z.ZodType<TResponseData>;
}): Promise<FetchResult<TResponseData>> {
  try {
    const tokenxGrant = await requestOboToken(idportenToken, clientId);

    if (!tokenxGrant.ok) {
      const error = `Failed to exchange idporten token: ${tokenxGrant.error}`;
      logger.error(error);
      return { success: false, error };
    }

    const response = await fetch(endpoint, {
      method,
      headers: {
        Authorization: `Bearer ${tokenxGrant.token}`,
        "Nav-Consumer-Id": "oppfolgingsplan",
        "Nav-Call-Id": nanoid(),
        "Content-Type": "application/json",
      },
      ...(body ? { body: JSON.stringify(body) } : {}),
    });

    if (!response.ok) {
      const error = `Failed to fetch data from ${endpoint}: ${response.statusText}`;
      logger.error(error);
      return { success: false, error };
    }

    const data = await response.json();

    if (schema) {
      const parsed = schema.safeParse(data);
      if (!parsed.success) {
        const error = "Failed to parse result! " + parsed.error;
        logger.error(error);
        return { success: false, error };
      }
      return { success: true, data: parsed.data };
    }

    return { success: true, data: data as TResponseData };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    logger.error(`Unexpected error in authenticatedFetch: ${message}`);
    return { success: false, error: `Request failed: ${message}` };
  }
}
