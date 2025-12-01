import z from "zod";
import { commonResponseFieldsForAGSchema } from "./commonResponseFieldsSchemas";
import { ferdigstiltPlanMetadataSchema } from "./ferdigstiltPlanMetadataSchema";
import { organizationDetailsSchema } from "./organizationDetailsSchema";

// TODO
const formSnapshotSchema = z.object({});

export const ferdigstiltPlanResponseForAGSchema = z.object({
  ...commonResponseFieldsForAGSchema.shape,
  oppfolgingsplan: z.object({
    id: z.string(),
    ...ferdigstiltPlanMetadataSchema.shape,
    content: formSnapshotSchema,
  }),
});

export type FerdigstiltPlanResponseForAG = z.infer<
  typeof ferdigstiltPlanResponseForAGSchema
>;

export const ferdigstiltPlanResponseForSMSchema = z.object({
  organization: organizationDetailsSchema,
  oppfolgingsplan: z.object({
    id: z.string(),
    ...ferdigstiltPlanMetadataSchema.shape,
    content: formSnapshotSchema,
  }),
});

export type FerdigstiltPlanResponseForSM = z.infer<
  typeof ferdigstiltPlanResponseForSMSchema
>;
