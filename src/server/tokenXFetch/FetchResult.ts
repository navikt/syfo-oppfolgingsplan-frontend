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

export type FetchResultError = z.infer<typeof fetchResultErrorSchema>;

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
