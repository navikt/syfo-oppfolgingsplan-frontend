export type ErrorType =
  | "UNAUTHORIZED"
  | "FAILED_GRANT"
  | "FETCH_FAILED"
  | "SCHEMA_PARSING_FAILED"
  | "UNEXPECTED_ERROR";

export type FetchResult<T> =
  | { success: true; data: T }
  | { success: false; errorType: ErrorType; errorMessage: string };
