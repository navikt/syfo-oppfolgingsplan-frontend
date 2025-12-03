import z from "zod";
import { formSnapshotSchema } from "@/utils/FormSnapshot/schemas/FormSnapshot";
import { commonResponseFieldsForAGSchema } from "./commonResponseFieldsSchemas";
import { ferdigstiltPlanMetadataSchema } from "./ferdigstiltPlanMetadataSchema";

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
