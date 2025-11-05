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
  onSubmitAfterValidationPassed,
}: {
  initialValues: OppfolgingsplanForm | null;
  onDebouncedChange: () => void;
  onSubmitAfterValidationPassed: () => void;
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
    onSubmit: () => {
      // will not run if form is invalid
      onSubmitAfterValidationPassed();
    },
  });

  const focusThisOnValidationErrorsRef = useRef<HTMLDivElement>(null);

  function validateAndSubmitIfValid() {
    form.handleSubmit();
    setTimeout(() => {
      // maybe this should be done differently
      if (!form.state.isValid) {
        focusThisOnValidationErrorsRef.current?.focus();
      }
    }, 0);
  }

  return {
    form,
    validateAndSubmitIfValid,
    focusThisOnValidationErrorsRef,
  };
}
