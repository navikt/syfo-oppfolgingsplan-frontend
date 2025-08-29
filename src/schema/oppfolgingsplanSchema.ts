import { array, boolean, object, string, z } from "zod";

export const utkastMetadataSchema = object({
  uuid: string(),
  sykmeldtFnr: string(),
  narmesteLederFnr: string(),
  organisasjonsnummer: string(),
  sluttdato: string().date().nullish(),
});

export const oppfolgingsplanMetadataSchema = object({
  uuid: string(),
  sykmeldtFnr: string(),
  narmesteLederFnr: string(),
  organisasjonsnummer: string(),
  sluttdato: string().date(),
  skalDelesMedVeileder: boolean(),
  deltMedVeilederTidspunkt: string().date().nullish(),
  skalDelesMedLege: boolean(),
  deltMedLegeTidspunkt: string().date().nullish(),
  createdAt: string().datetime(),
});

export const oppfolgingsplanOverviewSchema = object({
  utkast: utkastMetadataSchema.nullish(),
  oppfolgingsplan: oppfolgingsplanMetadataSchema.nullish(),
  previousOppfolgingsplaner: array(oppfolgingsplanMetadataSchema),
});

export type OppfolgingsplanOverview = z.infer<
  typeof oppfolgingsplanOverviewSchema
>;
