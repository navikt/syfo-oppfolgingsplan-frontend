import z from "zod";
import {
  CombinedErrorType,
  combinedErrorTypeSchema,
} from "@/schema/errorSchemas.ts";

/**
 * Backend can respond with an error object of this shape on all endpoints.
 * This type is also thrown from tokenXFetch or returned as part of the
 * result object from tokenXFetchUpdate or tokenXFetchUpdateWithResponse
 * when something goes wrong.
 */
export const fetchResultErrorSchema = z.object({
  type: combinedErrorTypeSchema,
  message: z.string().optional(),
});

export type FetchResultError = z.infer<typeof fetchResultErrorSchema>;

function safeJsonParse(value: unknown): unknown | null {
  if (typeof value !== "string") return null;
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

/**
 * Attempts to parse an unknown thrown value as a FetchResultError.
 *
 * In our codebase we usually throw a plain object shaped like `FetchResultError`.
 * However, depending on where the error is rethrown/serialized, it may appear as:
 * - an `Error` whose `message` is a JSON string
 * - an `Error` with the original value stored in `cause`
 */
/**
 * Collects potential error candidates from various serialized forms.
 * Next.js may serialize errors as JSON in message or via cause.
 */
function collectCandidates(err: unknown): unknown[] {
  if (!(err instanceof Error)) return [err];

  const cause = (err as { cause?: unknown }).cause;
  return [err, safeJsonParse(err.message), cause, safeJsonParse(cause)];
}

/**
 * Extracts a strongly-typed CombinedErrorType from an unknown error.
 * Returns null if the error is not a recognized FetchResultError.
 *
 * Use this in error boundaries to get the error type for custom messaging.
 */
export function extractFetchErrorType(err: unknown): CombinedErrorType | null {
  for (const candidate of collectCandidates(err)) {
    if (candidate && typeof candidate === "object" && "type" in candidate) {
      const parsed = combinedErrorTypeSchema.safeParse(candidate.type);
      if (parsed.success) return parsed.data;
    }
  }
  return null;
}

export type FetchUpdateResult = {
  error: FetchResultError | null;
};

export type FetchUpdateResultWithResponse<T> =
  | {
      error: null;
      data: T;
    }
  | {
      error: FetchResultError;
      data: null;
    };
