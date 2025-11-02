import { useRef } from "react";
import { revalidateLogic } from "@tanstack/react-form";
import { LAGRE_UTKAST_DEBOUNCE_DELAY } from "@/constants/app-config";
import {
  OppfolgingsplanForm,
  OppfolgingsplanFormFerdigstillValidering,
} from "@/schema/oppfolgingsplanFormSchemas";
import { oppfolgingsplanFormDefaultValues } from "../form-options";
import { useAppForm } from "./form";

export default function useOppfolgingsplanForm({
  initialValues,
  onDebouncedChange,
}: {
  initialValues: Partial<OppfolgingsplanForm> | null;
  onDebouncedChange: () => void;
}) {
  const form = useAppForm({
    defaultValues: {
      ...oppfolgingsplanFormDefaultValues,
      ...initialValues,
    },
    validationLogic: revalidateLogic(),
    validators: {
      onDynamic: OppfolgingsplanFormFerdigstillValidering,
    },
    listeners: {
      onChange: onDebouncedChange,
      onChangeDebounceMs: LAGRE_UTKAST_DEBOUNCE_DELAY,
    },
    onSubmit: async () => {
      // will not run if form is invalid
    },
  });

  const focusThisOnValidationErrorsRef = useRef<HTMLDivElement>(null);

  function triggerValidationAndGetIsValid() {
    form.validate("submit");
    if (!form.state.isValid) {
      setTimeout(() => {
        focusThisOnValidationErrorsRef.current?.focus();
      });
    }
    return form.state.isValid;
  }

  return {
    form,
    triggerValidationAndGetIsValid,
    focusThisOnValidationErrorsRef,
  };
}
