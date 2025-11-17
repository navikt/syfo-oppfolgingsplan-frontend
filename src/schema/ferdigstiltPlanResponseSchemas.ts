import z from "zod";
import { commonResponseFieldsForAGSchema } from "./commonResponseFieldsSchemas";

// TODO
const formSnapshotSchema = z.object({});

const oppfolgingsplanSchema = z.object({
  content: formSnapshotSchema,
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

export const ferdigstiltPlanResponseForAGSchema = z.object({
  ...commonResponseFieldsForAGSchema.shape,
  oppfolgingsplan: oppfolgingsplanSchema,
});

export type FerdigstiltPlanResponseForAG = z.infer<
  typeof ferdigstiltPlanResponseForAGSchema
>;
