import { createFormHook } from "@tanstack/react-form";
import FormDatePicker from "../field-components/FormDatePicker";
import FormRadioGroup from "../field-components/FormRadioGroup";
import FormTextArea from "../field-components/FormTextArea";
import { fieldContext, formContext } from "./form-context";

export const { useAppForm, withForm } = createFormHook({
  fieldComponents: {
    FormTextArea,
    FormDatePicker,
    FormRadioGroup,
  },
  formComponents: {},
  fieldContext,
  formContext,
});
