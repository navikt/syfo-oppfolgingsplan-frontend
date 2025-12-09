import z from "zod";

export const utkastMetadataSchema = z.object({
  sistLagretTidspunkt: z.iso.datetime(),
});

export type UtkastMetadata = z.infer<typeof utkastMetadataSchema>;
