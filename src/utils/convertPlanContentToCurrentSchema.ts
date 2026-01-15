import {
  OppfolgingsplanFormUnderArbeid,
  oppfolgingsplanFormUnderArbeidSchema,
} from "@/schema/oppfolgingsplanForm/formValidationSchemas";

export type PlanContent = Record<string, string | boolean | null>;

/**
 * Converts planContent to match current oppfolgingsplanFormUnderArbeidSchema.
 * `planContent` can be a stored utkast or be extracted from a ferdigstilt plan.
 * The conversion accounts for changes to the form schema in the time since the
 * content was saved. If a field exists in the content but not in the current
 * schema, it will be ignored. If a field that exists in the current schema is
 * missing or has invalid value in the stored content, it will be omitted from
 * the result.
 */
export function convertPlanContentToCurrentSchema(
  planContent: PlanContent,
): OppfolgingsplanFormUnderArbeid {
  const currentOppfolgingsplanSchemaShape =
    // The shape contains the internal Zod schemas for each field.
    oppfolgingsplanFormUnderArbeidSchema.shape;

  // Iterate over current form schema fields and pick corresponding values
  // from planContent. Validate each planContent value against current schema
  // for that field.
  const result = Object.entries(currentOppfolgingsplanSchemaShape).reduce(
    (acc, [fieldId, fieldSchema]) => {
      const lagretFieldValue = planContent[fieldId];
      const { success, data: parsedFieldValue } =
        fieldSchema.safeParse(lagretFieldValue);

      if (success) {
        return {
          ...acc,
          [fieldId]: parsedFieldValue,
        };
      } else {
        // Field is missing or has invalid value in planContent. Omit it.
        return acc;
      }
    },
    {} as OppfolgingsplanFormUnderArbeid,
  );

  return result;
}
