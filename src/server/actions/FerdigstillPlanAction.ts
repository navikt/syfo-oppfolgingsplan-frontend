import type z from "zod";
import type { FetchUpdateResult } from "../tokenXFetch/FetchResult";
import type { ferdigstillPlanActionPayloadSchema } from "./serverActionsInputValidation";

export type FerdigstillPlanActionPayload = z.infer<
  typeof ferdigstillPlanActionPayloadSchema
>;

export type FerdigstillPlanAction = (
  payload: FerdigstillPlanActionPayload,
) => Promise<FetchUpdateResult>;
