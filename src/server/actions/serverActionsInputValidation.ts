import z from "zod";
import { OppfolgingsplanFormFerdigstillSchema } from "@/schema/oppfolgingsplanFormSchemas";

export function isNonEmptyString(value: string) {
  return typeof value === "string" && value.trim() !== "";
}

export const ferdigstillPlanActionPayloadSchema = z.object({
  formValues: OppfolgingsplanFormFerdigstillSchema,
  evalueringsDatoIsoString: z.iso.date(),
  includeIkkeMedvirketBegrunnelseFieldInFormSnapshot: z.boolean(),
});
