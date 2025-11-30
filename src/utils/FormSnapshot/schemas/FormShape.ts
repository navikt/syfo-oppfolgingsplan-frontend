import z from "zod";

const commonFieldPropertiesSchema = z.object({
  fieldId: z.string(),
  label: z.string(),
  description: z.string().nullable(),
  wasRequired: z.boolean(),
});

export const textFieldShapeSchema = z.object({
  ...commonFieldPropertiesSchema.shape,
  fieldType: z.literal("TEXT"),
});

const radioGroupFieldOptionsSchema = z.object({
  optionId: z.string(),
  optionLabel: z.string(),
});

export const radioGroupFieldShapeSchema = z.object({
  ...commonFieldPropertiesSchema.shape,
  fieldType: z.literal("RADIO_GROUP"),
  options: z.array(radioGroupFieldOptionsSchema),
});

export const checkboxGroupFieldShapeSchema = z.object({
  ...commonFieldPropertiesSchema.shape,
  fieldType: z.literal("CHECKBOX_GROUP"),
  options: z.array(radioGroupFieldOptionsSchema),
});

export const checkboxSingleFieldShapeSchema = z.object({
  fieldId: z.string(),
  label: z.string(),
  // No description or wasRequired for single checkbox
  fieldType: z.literal("CHECKBOX_SINGLE"),
});

export const dateFieldShapeSchema = z.object({
  ...commonFieldPropertiesSchema.shape,
  fieldType: z.literal("DATE"),
});

export const dateTimeFieldShapeSchema = z.object({
  ...commonFieldPropertiesSchema.shape,
  fieldType: z.literal("DATE_TIME"),
});

export const formSectionShapeSchema = z.object({
  sectionId: z.string(),
  sectionTitle: z.string(),
  fields: z.array(
    z.discriminatedUnion("fieldType", [
      textFieldShapeSchema,
      radioGroupFieldShapeSchema,
      checkboxGroupFieldShapeSchema,
      checkboxSingleFieldShapeSchema,
      dateFieldShapeSchema,
      dateTimeFieldShapeSchema,
    ]),
  ),
});

export const formShapeSchema = z.object({
  formIdentifier: z.string(),
  formSemanticVersion: z.string(),
  formSnapshotVersion: z.string(),
  sections: z.array(formSectionShapeSchema),
});

export type FormSnapshotFormShape = z.infer<typeof formShapeSchema>;
