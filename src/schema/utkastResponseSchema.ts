import z from "zod";
import { commonResponseFieldsForAGSchema } from "./commonResponseFieldsSchemas";
import { OppfolgingsplanForm } from "./oppfolgingsplanFormSchemas";
import { utkastMetadataSchema } from "./utkastMetadataSchema";

const utkastResponseContentSchema = z.record(
  z.string(),
  z.union([z.string(), z.null()]),
);

export const utkastResponseForAGSchema = z.object({
  ...commonResponseFieldsForAGSchema.shape,
  utkast: z
    .object({
      ...utkastMetadataSchema.shape,
      content: utkastResponseContentSchema,
    })
    .nullable(),
});

export type ConvertedLagretUtkastData = z.infer<
  typeof utkastResponseForAGSchema
> & {
  utkast: {
    sistLagretTidspunkt: Date;
    content: Partial<OppfolgingsplanForm>;
  } | null;
};
