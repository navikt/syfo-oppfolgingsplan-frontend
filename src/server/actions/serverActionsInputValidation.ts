import z from "zod";
import { oppfolgingsplanFormUtfylltSchema } from "@/schema/oppfolgingsplanForm/formValidationSchemas";

export function isNonEmptyString(value: string) {
  return typeof value === "string" && value.trim() !== "";
}

export const ferdigstillPlanActionPayloadSchema = z.object({
  formValues: oppfolgingsplanFormUtfylltSchema,
  evalueringsDatoIsoString: z.iso.date(),
  includeIkkeMedvirketBegrunnelseFieldInFormSnapshot: z.boolean(),
});
