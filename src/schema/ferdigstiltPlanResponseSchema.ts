import z from "zod";
import { commonResponseFieldsForAGSchema } from "./commonResponseFieldsSchemas";

// TODO
const FormSnapshotSchema = z.object({});

export const ferdigstiltPlanResponseForAGSchema = z.object({
  ...commonResponseFieldsForAGSchema.shape,
  isAktivPlan: z.boolean(),
  content: FormSnapshotSchema,
  opprettetTidspunkt: z.iso
    .datetime()
    .transform((dateString) => new Date(dateString)),
  evalueringsDato: z.iso.date().transform((dateString) => new Date(dateString)),
  deltMedLegeTidspunkt: z.iso
    .datetime()
    .transform((dateString) => new Date(dateString))
    .nullable(),
  deltMedVeilederTidspunkt: z.iso
    .datetime()
    .transform((dateString) => new Date(dateString))
    .nullable(),
});

export type FerdigstiltPlanResponseForAG = z.infer<
  typeof ferdigstiltPlanResponseForAGSchema
>;
