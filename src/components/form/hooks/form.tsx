import { createFormHook } from "@tanstack/react-form";
import { fieldContext, formContext } from "./form-context.tsx";
import { BoundTextArea } from "@/components/form/formComponents/boundTextArea.tsx";
import { BoundDatePicker } from "@/components/form/formComponents/boundDatePicker.tsx";
import { BoundSubmitButton } from "@/components/form/formComponents/boundSubmitButton.tsx";

export const { useAppForm, withForm } = createFormHook({
  fieldComponents: {
    BoundTextArea,
    BoundDatePicker,
  },
  formComponents: {
    BoundSubmitButton,
  },
  fieldContext,
  formContext,
});
