import z from "zod";
import { commonResponseFieldsSchema } from "./commonResponseFieldsSchemas";
import { OppfolgingsplanFormUnderArbeid } from "./oppfolgingsplanFormSchemas";
import { utkastMetadataSchema } from "./utkastMetadataSchema";

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
    sistLagretTidspunkt: string;
    content: OppfolgingsplanFormUnderArbeid;
  } | null;
};
