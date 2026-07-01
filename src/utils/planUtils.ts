import type { FormSnapshot } from "@/utils/FormSnapshot/schemas/FormSnapshot";

export function hasMedvirket(content: FormSnapshot): boolean {
  const field = content.sections
    .flatMap((s) => s.fields)
    .find((f) => f.fieldId === "harDenAnsatteMedvirket");

  return field?.fieldType === "RADIO_GROUP" && field.selectedOptionId === "ja";
}
