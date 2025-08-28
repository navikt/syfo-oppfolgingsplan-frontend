import { array, boolean, date, object, string, z } from "zod";

export const utkastMetadataSchema = object({
  uuid: string(),
  sykmeldtFnr: string(),
  narmesteLederFnr: string(),
  organisasjonsnummer: string(),
  sluttDato: date().nullish(),
});

export const oppfolgingsplanMetadataSchema = object({
  uuid: string(),
  sykmeldtFnr: string(),
  narmesteLederFnr: string(),
  organisasjonsnummer: string(),
  sluttDato: date(),
  skalDelesMedVeileder: boolean(),
  deltMedVeilederTidspunkt: date().nullish(),
  skalDelesMedLege: boolean(),
  deltMedLegeTidspunkt: date().nullish(),
  createdAt: date(),
});

export const oppfolgingsplanOverviewSchema = object({
  utkast: utkastMetadataSchema.nullish(),
  oppfolgingsplan: oppfolgingsplanMetadataSchema.nullish(),
  previousOppfolgingsplaner: array(oppfolgingsplanMetadataSchema),
});

export type OppfolgingsplanOverview = z.infer<
  typeof oppfolgingsplanOverviewSchema
>;
