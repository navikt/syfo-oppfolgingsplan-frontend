import { array, boolean, object, string, z } from "zod";

export const utkastDataForOversiktSchema = object({
  uuid: string(),
  sykmeldtFnr: string(),
  narmesteLederFnr: string(),
  organisasjonsnummer: string(),
  evalueringsdato: string().date().nullish(),
});

export const oppfolgingsplanMetadataSchema = object({
  uuid: string(),
  sykmeldtFnr: string(),
  narmesteLederFnr: string(),
  organisasjonsnummer: string(),
  evalueringsdato: string().date(),
  skalDelesMedVeileder: boolean(),
  deltMedVeilederTidspunkt: string().date().nullish(),
  skalDelesMedLege: boolean(),
  deltMedLegeTidspunkt: string().date().nullish(),
  createdAt: string().datetime(),
});

// TODO: vurdere skjemaet
export const oppfolgingsplanOverviewSchema = object({
  utkast: utkastDataForOversiktSchema.nullable(),
  oppfolgingsplan: oppfolgingsplanMetadataSchema.nullable(),
  previousOppfolgingsplaner: array(oppfolgingsplanMetadataSchema),
});

export type OppfolgingsplanDataForOversikt = z.infer<
  typeof oppfolgingsplanMetadataSchema
>;

export type UtkastDataForOversikt = z.infer<typeof utkastDataForOversiktSchema>;

export type OppfolgingsplanerDataForOversikt = z.infer<
  typeof oppfolgingsplanOverviewSchema
>;
