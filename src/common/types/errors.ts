import { FrontendErrorType } from "@/server/actions/FrontendErrorTypeEnum.ts";
import { FetchResultError } from "@/server/tokenXFetch/FetchResult.ts";

export enum BackendErrorType {
  AUTHENTICATION_ERROR = "AUTHENTICATION_ERROR",
  AUTHORIZATION_ERROR = "AUTHORIZATION_ERROR",
  NOT_FOUND = "NOT_FOUND",
  INTERNAL_SERVER_ERROR = "INTERNAL_SERVER_ERROR",
  ILLEGAL_ARGUMENT = "ILLEGAL_ARGUMENT",
  BAD_REQUEST = "BAD_REQUEST",
  LEGE_NOT_FOUND = "LEGE_NOT_FOUND",
  PLAN_NOT_FOUND = "PLAN_NOT_FOUND",
  SYKMELDT_NOT_FOUND = "SYKMELDT_NOT_FOUND",
  CONFLICT = "CONFLICT",
}

export type StandardActionErrorType =
  | BackendErrorType.AUTHENTICATION_ERROR
  | BackendErrorType.AUTHORIZATION_ERROR
  | BackendErrorType.NOT_FOUND
  | BackendErrorType.INTERNAL_SERVER_ERROR
  | BackendErrorType.BAD_REQUEST
  | FrontendErrorType;

export type DelPlanMedLegeErrorType =
  | StandardActionErrorType
  | BackendErrorType.LEGE_NOT_FOUND
  | BackendErrorType.PLAN_NOT_FOUND
  | BackendErrorType.CONFLICT;

export type DelPlanMedVeilederErrorType =
  | StandardActionErrorType
  | BackendErrorType.PLAN_NOT_FOUND
  | BackendErrorType.CONFLICT;

export type ActionError<E extends string = string> = FetchResultError<E>;
