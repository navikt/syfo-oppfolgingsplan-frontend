import { FormSnapshot, FormSnapshotField } from "./schemas/FormSnapshot";

export function extractValuesFromFormSnapshot(
  formSnapshot: FormSnapshot,
): Record<string, string | boolean | null> {
  const snapshotFields = formSnapshot.sections.flatMap(
    (section) => section.fields,
  );

  const fieldIdsToValues = snapshotFields.reduce(
    (acc, field) => {
      const { fieldId } = field;

      return {
        ...acc,
        [fieldId]: getValueBasedOnFieldType(field),
      };
    },
    {} as Record<string, string | boolean | null>,
  );

  return fieldIdsToValues;
}

function getValueBasedOnFieldType(field: FormSnapshotField) {
  const { fieldType } = field;

  switch (fieldType) {
    case "TEXT":
      return field.value ?? "";
    case "RADIO_GROUP":
      return field.selectedOptionId;
    case "CHECKBOX_GROUP":
      // TODO: tenke gjennom hvordan verdier representeres i form-state for "CHECKBOX_GROUP" og "CHECKBOX_SINGLE"
      return field.options
        .filter((option) => option.wasSelected)
        .map((option) => option.optionId)
        .join(",");
    case "CHECKBOX_SINGLE":
      return field.value;
    case "DATE":
      return field.value;
    case "DATE_TIME":
      return field.value;
  }
}
