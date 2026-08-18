import { z } from "zod";
import { ferdigstiltPlanMetadataSchema } from "./ferdigstiltPlanMetadataSchema";
import { organizationDetailsSchema } from "./organizationDetailsSchema";
import { meldtAvSchema } from "./unntaksvurderingSchemas";

export const ferdigstiltPlanHendelseSchema = z.object({
  type: z.literal("FERDIGSTILT_PLAN"),
  id: z.string(),
  ...ferdigstiltPlanMetadataSchema.shape,
});

export const planIkkeNodvendigHendelseSchema = z.object({
  type: z.literal("PLAN_IKKE_NODVENDIG"),
  id: z.string(),
  meldtTidspunkt: z.iso.datetime(),
  meldtAv: meldtAvSchema,
});

export const oppfolgingsplanhendelseSchema = z.discriminatedUnion("type", [
  ferdigstiltPlanHendelseSchema,
  planIkkeNodvendigHendelseSchema,
]);

export const sykmeldtVirksomhetsoversiktSchema = z.object({
  organization: organizationDetailsSchema,
  oppfolgingsplanhendelser: z.array(oppfolgingsplanhendelseSchema),
});

export type OppfolgingsplanHendelse = z.infer<
  typeof oppfolgingsplanhendelseSchema
>;
export type PlanIkkeNodvendigHendelse = z.infer<
  typeof planIkkeNodvendigHendelseSchema
>;
export type SykmeldtVirksomhetsoversikt = z.infer<
  typeof sykmeldtVirksomhetsoversiktSchema
>;
