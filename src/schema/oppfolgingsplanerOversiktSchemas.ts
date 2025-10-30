import { array, boolean, object, string, z } from "zod";

export const utkastMetadataSchema = object({
  sykmeldtFnr: string(),
  narmesteLederFnr: string(),
  organisasjonsnummer: string(),
  updatedAt: z.iso.datetime(),
});

export type UtkastMetadata = z.infer<typeof utkastMetadataSchema>;

export const oppfolgingsplanMetadataSchema = object({
  uuid: string(),
  sykmeldtFnr: string(),
  narmesteLederFnr: string(),
  organisasjonsnummer: string(),
  evalueringsdato: z.iso.date(),
  skalDelesMedVeileder: boolean(),
  deltMedVeilederTidspunkt: z.iso.date().nullish(),
  skalDelesMedLege: boolean(),
  deltMedLegeTidspunkt: z.iso.date().nullish(),
  createdAt: z.iso.datetime(),
});

export type OppfolgingsplanMetadata = z.infer<
  typeof oppfolgingsplanMetadataSchema
>;

export const oppfolgingsplanerOversiktResponseSchema = object({
  utkast: utkastMetadataSchema.nullable(),
  oppfolgingsplan: oppfolgingsplanMetadataSchema.nullable(),
  previousOppfolgingsplaner: array(oppfolgingsplanMetadataSchema),
});

export type OppfolgingsplanerOversikt = z.infer<
  typeof oppfolgingsplanerOversiktResponseSchema
>;
