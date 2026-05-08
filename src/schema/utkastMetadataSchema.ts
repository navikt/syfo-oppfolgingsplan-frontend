import z from "zod";

export const utkastMetadataSchema = z.object({
  sistLagretTidspunkt: z.iso.datetime(),
  utkastUtloperDato: z.iso.datetime().optional(),
});

export type UtkastMetadata = z.infer<typeof utkastMetadataSchema>;
