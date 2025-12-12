import z from "zod";

export const frontendErrorTypeSchema = z.enum([
  "AUTHENTICATION_ERROR",
  "OK_RESPONSE_BUT_RESPONSE_BODY_INVALID",
  "SERVER_ACTION_INPUT_VALIDATION_ERROR",
  "FETCH_UNKOWN_ERROR_RESPONSE",
  "FETCH_NETWORK_ERROR",
]);

export const backendErrorTypeSchema = z.enum([
  "AUTHENTICATION_ERROR",
  "AUTHORIZATION_ERROR",
  "NOT_FOUND",
  "INTERNAL_SERVER_ERROR",
  "ILLEGAL_ARGUMENT",
  "BAD_REQUEST",
  "LEGE_NOT_FOUND",
  "PLAN_NOT_FOUND",
  "SYKMELDT_NOT_FOUND",
  "CONFLICT",
]);

export const combinedErrorTypeSchema = z.union([
  backendErrorTypeSchema,
  frontendErrorTypeSchema,
]);

export type CombinedErrorType = z.infer<typeof combinedErrorTypeSchema>;
