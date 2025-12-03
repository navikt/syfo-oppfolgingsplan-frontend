import {
  OppfolgingsplanForm,
  OppfolgingsplanFormAndUtkastSchema,
} from "@/schema/oppfolgingsplanFormSchemas";

/**
 * Converts planContent to current OppfolgingsplanFormAndUtkastSchema.
 * `planContent` can be a stored utkast or come from a ferdigstilt plan. This
 * accounts for changes to the form schema since the content was saved. If a
 * field exists in the content but not in the current schema, it will be ignored.
 * If a field that exists in the current schema is missing or has invalid value
 * in the stored content, it will be omitted from the returned object.
 */
export function convertPlanContentToCurrentSchema(
  planContent: Record<string, string | boolean | null>,
): Partial<OppfolgingsplanForm> {
  const oppfolgingsplanFormSchemaShape =
    OppfolgingsplanFormAndUtkastSchema.shape;

  // Iterate over current form schema fields and pick corresponding values
  // from lagretUtkast. Validate each lagretUtkast value against current schema
  // for that field.
  const result = Object.entries(oppfolgingsplanFormSchemaShape).reduce(
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
        // Field is missing or has invalid value in lagretUtkast.
        return acc;
      }
    },
    {} as Partial<OppfolgingsplanForm>,
  );

  return result;
}
