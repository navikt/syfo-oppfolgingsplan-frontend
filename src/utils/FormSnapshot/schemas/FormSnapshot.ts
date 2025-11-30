import z from "zod";
import {
  checkboxGroupFieldShapeSchema,
  checkboxSingleFieldShapeSchema,
  dateFieldShapeSchema,
  dateTimeFieldShapeSchema,
  formSectionShapeSchema,
  formShapeSchema,
  radioGroupFieldShapeSchema,
  textFieldShapeSchema,
} from "./FormShape";

export const textFieldSnapshot = z.object({
  ...textFieldShapeSchema.shape,
  value: z.string(),
});

export const radioGroupFieldSnapshotSchema = z.object({
  ...radioGroupFieldShapeSchema.shape,
  selectedOptionId: z.string().nullable(),
});

export const checkboxGroupFieldSnapshotSchema = z.object({
  ...checkboxGroupFieldShapeSchema.shape,
  options: z.array(
    z.object({
      optionId: z.string(),
      optionLabel: z.string(),
      wasSelected: z.boolean(),
    }),
  ),
});

export const checkboxSingleFieldSnapshotSchema = z.object({
  ...checkboxSingleFieldShapeSchema.shape,
  value: z.boolean(),
});

export const dateFieldSnapshotSchema = z.object({
  ...dateFieldShapeSchema.shape,
  value: z.iso.date().nullable(),
});

export const dateTimeFieldSnapshotSchema = z.object({
  ...dateTimeFieldShapeSchema.shape,
  value: z.iso.datetime().nullable(),
});

export const formSnapshotSchema = z.object({
  ...formShapeSchema.shape,
  sections: z.array(
    z.object({
      ...formSectionShapeSchema.shape,
      fields: z.array(
        z.discriminatedUnion("fieldType", [
          textFieldSnapshot,
          radioGroupFieldSnapshotSchema,
          checkboxGroupFieldSnapshotSchema,
          checkboxSingleFieldSnapshotSchema,
          dateFieldSnapshotSchema,
          dateTimeFieldSnapshotSchema,
        ]),
      ),
    }),
  ),
});

export type FormSnapshot = z.infer<typeof formSnapshotSchema>;
