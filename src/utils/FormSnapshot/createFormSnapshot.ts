import type { FormSnapshotFormShape } from "./schemas/FormShape";
import {
  checkboxSingleFieldSnapshotSchema,
  dateFieldSnapshotSchema,
  dateTimeFieldSnapshotSchema,
  type FormSnapshot,
  radioGroupFieldSnapshotSchema,
  textFieldSnapshot,
} from "./schemas/FormSnapshot";

type FormValues = Record<string, string | string[] | boolean | null>;

export function createFormSnapshot(
  formShape: FormSnapshotFormShape,
  values: FormValues,
): FormSnapshot {
  try {
    const formSnapsthot = {
      ...formShape,
      sections: formShape.sections.map((sectionShape) => ({
        ...sectionShape,
        fields: sectionShape.fields.map((fieldShape) => {
          const value = values[fieldShape.fieldId] ?? null;

          switch (fieldShape.fieldType) {
            case "TEXT":
              return {
                ...fieldShape,
                value: textFieldSnapshot.shape.value.parse(value),
              };
            case "RADIO_GROUP":
              return {
                ...fieldShape,
                selectedOptionId:
                  radioGroupFieldSnapshotSchema.shape.selectedOptionId.parse(
                    value,
                  ),
              };
            case "CHECKBOX_GROUP": {
              if (!Array.isArray(value)) {
                throw new Error(
                  `createFormSnapshot expected array for CHECKBOX_GROUP field value but got: ${value}`,
                );
              }
              const selectedOptionIds = value;

              return {
                ...fieldShape,
                options: fieldShape.options.map((option) => ({
                  ...option,
                  wasSelected: selectedOptionIds.includes(option.optionId),
                })),
              };
            }
            case "CHECKBOX_SINGLE":
              return {
                ...fieldShape,
                value:
                  checkboxSingleFieldSnapshotSchema.shape.value.parse(value),
              };
            case "DATE":
              return {
                ...fieldShape,
                value: dateFieldSnapshotSchema.shape.value.parse(value),
              };
            case "DATE_TIME":
              return {
                ...fieldShape,
                value: dateTimeFieldSnapshotSchema.shape.value.parse(value),
              };
          }
        }),
      })),
    };

    return formSnapsthot;
  } catch (err) {
    throw new Error(`createFormSnapshot could not parse a value: ${err}`);
  }
}
