import { startTransition, useRef, useState, useTransition } from "react";
import { useParams, useRouter } from "next/navigation";
import { revalidateLogic } from "@tanstack/react-form";
import { VeiviserSteg } from "@/components/OpprettPlanPage/LagPlanVeiviser";
import { SAVE_UTKAST_DEBOUNCE_DELAY } from "@/constants/app-config";
import { getAGOversiktHref } from "@/constants/route-hrefs";
import {
  OppfolgingsplanForm,
  OppfolgingsplanFormFerdigstillValidering,
} from "@/schema/oppfolgingsplanFormSchemas";
import { oppfolgingsplanFormDefaultValues } from "../form-options";
import { useAppForm } from "./form";
import useOppfolgingsplanLagring from "./useOppfolgingsplanLagring";

type FormMeta = {
  submitAction:
    | "avsluttOgFortsettSenere"
    | "fortsettTilOppsummering"
    | "ferdigstill";
};

const defaultMeta: FormMeta = {
  submitAction: "fortsettTilOppsummering",
};

export default function useOppfolgingsplanForm({
  initialSavedValues,
  initialLastSavedTime,
}: {
  initialSavedValues: OppfolgingsplanForm | null;
  initialLastSavedTime: Date | null;
}) {
  const { narmesteLederId } = useParams<{ narmesteLederId: string }>();

  const [veiviserSteg, setVeiviserSteg] = useState(VeiviserSteg.FYLL_UT_PLAN);

  const [isPendingProceedToOppsummering, startProceedToOppsummeringTransition] =
    useTransition();
  const [isPendingExitAndContinueLater, startExitAndContinueLaterTransition] =
    useTransition();

  const focusThisOnValidationErrorsRef = useRef<HTMLDivElement>(null);

  const { push } = useRouter();

  const initialFormValues: OppfolgingsplanForm = {
    ...oppfolgingsplanFormDefaultValues,
    ...initialSavedValues,
  };

  const form = useAppForm({
    defaultValues: initialFormValues,
    validationLogic: revalidateLogic(),
    validators: {
      onDynamic: OppfolgingsplanFormFerdigstillValidering,
    },
    listeners: {
      onChange: ({ formApi }) =>
        startSaveUtkast({ values: formApi.state.values }),
      onChangeDebounceMs: SAVE_UTKAST_DEBOUNCE_DELAY,
    },
    onSubmitInvalid: () => {
      focusThisOnValidationErrorsRef.current?.focus();
    },
    onSubmitMeta: defaultMeta,
    onSubmit: ({ value, meta }) => {
      // will not run if form is invalid

      if (meta.submitAction === "fortsettTilOppsummering") {
        saveIfChangesAndProceedToOppsummering(value);
      } else if (meta.submitAction === "ferdigstill") {
        startFerdigstillPlan(value);
      }
    },
  });

  const {
    isSavingUtkast,
    utkastLastSavedTime,
    startSaveUtkast,
    startFerdigstillPlan,
    isPendingFerdigstillPlan,
  } = useOppfolgingsplanLagring({
    initialFormValues,
    initialLastSavedTime,
  });

  function saveIfChangesAndProceedToOppsummering(values: OppfolgingsplanForm) {
    startProceedToOppsummeringTransition(() => {
      startSaveUtkast({
        values,
        onSuccess: () => {
          proceedToOppsummeringSteg();
        },
      });
    });
  }

  function saveIfChangesAndExit() {
    startExitAndContinueLaterTransition(() => {
      startSaveUtkast({
        values: form.state.values,
        onSuccess: () => {
          push(getAGOversiktHref(narmesteLederId));
        },
      });
    });
  }

  function proceedToOppsummeringSteg() {
    startTransition(() => {
      setVeiviserSteg(VeiviserSteg.OPPSUMMERING);
    });
  }

  function goBackToFyllUtPlanSteg() {
    startTransition(() => {
      setVeiviserSteg(VeiviserSteg.FYLL_UT_PLAN);
    });
  }

  return {
    form,
    veiviserSteg,
    focusThisOnValidationErrorsRef,
    isSavingUtkast,
    utkastLastSavedTime,
    isPendingProceedToOppsummering,
    isPendingExitAndContinueLater,
    isPendingFerdigstillPlan,
    saveIfChangesAndExit,
    goBackToFyllUtPlanSteg,
  };
}
