import z from "zod";

export const utkastMetadataSchema = z.object({
  sistLagretTidspunkt: z.iso
    .datetime()
    .transform((dateString) => new Date(dateString)),
});

export type UtkastMetadata = z.infer<typeof utkastMetadataSchema>;
