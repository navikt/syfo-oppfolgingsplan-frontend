import z from "zod";
import { commonResponseFieldsSchema } from "./commonResponseFieldsSchemas";
import { OppfolgingsplanFormUnderArbeid } from "./oppfolgingsplanForm/formValidationSchemas";
import { utkastMetadataSchema } from "./utkastMetadataSchema";

// Raw as in not yet converted to current OppfolgingsplanFormUnderArbeid schema
const rawUtkastResponseContentSchema = z.record(
  z.string(),
  z.union([z.string(), z.null()]),
);

export const rawUtkastResponseForAGSchema = z.object({
  ...commonResponseFieldsSchema.shape,
  utkast: z
    .object({
      ...utkastMetadataSchema.shape,
      content: rawUtkastResponseContentSchema,
    })
    .nullable(),
});

export type ConvertedLagretUtkastResponse = z.infer<
  typeof rawUtkastResponseForAGSchema
> & {
  utkast: {
    sistLagretTidspunkt: string;
    content: OppfolgingsplanFormUnderArbeid;
  } | null;
};
