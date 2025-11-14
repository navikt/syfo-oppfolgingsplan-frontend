import z from "zod";
import { commonResponseFieldsForAGSchema } from "./commonResponseFieldsSchemas";

// TODO
const FormSnapshotSchema = z.object({});

export const ferdigstiltPlanResponseForAGSchema = z.object({
  ...commonResponseFieldsForAGSchema.shape,
  content: FormSnapshotSchema,
  evalueringsDato: z.iso.datetime(),
  deltMedLegeTidspunkt: z.iso.datetime().nullable(),
  deltMedVeilederTidspunkt: z.iso.datetime().nullable(),
  ferdistiltTidspunkt: z.iso.datetime(),
});

export type FerdigstiltPlanResponseForAG = z.infer<
  typeof ferdigstiltPlanResponseForAGSchema
>;
