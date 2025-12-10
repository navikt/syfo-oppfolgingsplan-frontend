import z from "zod";

/**
 * Backend can respond with an error object of this shape on all endpoints.
 * This type is also thrown from tokenXFetch or returned as part of the
 * result object from tokenXFetchUpdate or tokenXFetchUpdateWithResponse
 * when something goes wrong.
 */
export const fetchResultErrorSchema = z.object({
  type: z.string(),
  message: z.string().optional(),
});

export type FetchResultError<E extends string = string> = {
  type: E;
  message?: string;
};

export type Result<T, E extends string = string> =
  | { success: true; data: T }
  | { success: false; error: FetchResultError<E> };

export type FetchUpdateResult<E extends string = string> = Result<void, E>;
export type FetchUpdateResultWithResponse<
  T,
  E extends string = string,
> = Result<T, E>;
