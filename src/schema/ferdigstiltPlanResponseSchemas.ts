import z from "zod";
import { formSnapshotSchema } from "@/utils/FormSnapshot/schemas/FormSnapshot";
import { commonResponseFieldsSchema } from "./commonResponseFieldsSchemas";
import { ferdigstiltPlanMetadataSchema } from "./ferdigstiltPlanMetadataSchema";

export const ferdigstiltPlanResponseSchema = z.object({
  ...commonResponseFieldsSchema.shape,
  oppfolgingsplan: z.object({
    id: z.string(),
    ...ferdigstiltPlanMetadataSchema.shape,
    content: formSnapshotSchema,
  }),
});

export type FerdigstiltPlanResponse = z.infer<
  typeof ferdigstiltPlanResponseSchema
>;
