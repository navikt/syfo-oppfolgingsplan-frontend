import type { FormSnapshot } from "@/utils/FormSnapshot/schemas/FormSnapshot";

export function hasMedvirket(content: FormSnapshot): boolean {
  const field = content.sections
    .flatMap((s) => s.fields)
    .find((f) => f.fieldId === "harDenAnsatteMedvirket");

  if (!field || field.fieldType !== "RADIO_GROUP") {
    return false;
  }
  return field.selectedOptionId === "ja";
}
