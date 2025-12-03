import z from "zod";
import { OppfolgingsplanFormUnderArbeid } from "./oppfolgingsplanFormSchemas";
import { utkastMetadataSchema } from "./utkastMetadataSchema";
import { commonResponseFieldsSchema } from "./commonResponseFieldsSchemas";

const utkastResponseContentSchema = z.record(
  z.string(),
  z.union([z.string(), z.null()]),
);

export const utkastResponseForAGSchema = z.object({
  ...commonResponseFieldsSchema.shape,
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
    content: OppfolgingsplanFormUnderArbeid;
  } | null;
};
