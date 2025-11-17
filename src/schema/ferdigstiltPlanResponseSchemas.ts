import z from "zod";
import { commonResponseFieldsForAGSchema } from "./commonResponseFieldsSchemas";
import { ferdigstiltPlanMetadataSchema } from "./ferdigstiltPlanMetadataSchema";

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
