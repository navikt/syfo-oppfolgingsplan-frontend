import { startTransition, useRef, useState, useTransition } from "react";
import { useParams, useRouter } from "next/navigation";
import { revalidateLogic } from "@tanstack/react-form";
import { SAVE_UTKAST_DEBOUNCE_DELAY } from "@/common/app-config";
import { getAGOversiktHref } from "@/common/route-hrefs";
import { VeiviserSteg } from "@/components/OpprettPlanPage/LagPlanVeiviser";
import {
  OppfolgingsplanForm,
  OppfolgingsplanFormFerdigstillValidering,
} from "@/schema/oppfolgingsplanFormSchemas";
import { oppfolgingsplanFormDefaultValues } from "../form-options";
import { useAppForm } from "./form";
import useOppfolgingsplanFerdigstilling from "./useOppfolgingsplanFerdigstilling";
import useOppfolgingsplanUtkastLagring from "./useOppfolgingsplanUtkastLagring";

type FormMeta = {
  submitAction: "fortsettTilOppsummering" | "ferdigstill";
};

const defaultMeta: FormMeta = {
  submitAction: "fortsettTilOppsummering",
};

export default function useOppfolgingsplanForm({
  savedFormValues,
  lastSavedTime,
}: {
  savedFormValues: OppfolgingsplanForm | null;
  lastSavedTime: Date | null;
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
    ...savedFormValues,
  };

  const form = useAppForm({
    defaultValues: initialFormValues,
    validationLogic: revalidateLogic(),
    validators: {
      onDynamic: OppfolgingsplanFormFerdigstillValidering,
    },
    listeners: {
      onChange: ({ formApi }) =>
        startLagreUtkastIfChanges({ values: formApi.state.values }),
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
    lastSavedTime: utkastLastSavedTime,
    startLagreUtkastIfChanges,
  } = useOppfolgingsplanUtkastLagring({
    initialFormValues,
    initialLastSavedTime: lastSavedTime,
  });

  const { isPendingFerdigstillPlan, startFerdigstillPlan } =
    useOppfolgingsplanFerdigstilling();

  function saveIfChangesAndProceedToOppsummering(values: OppfolgingsplanForm) {
    startProceedToOppsummeringTransition(() => {
      startLagreUtkastIfChanges({
        values,
        onSuccess: () => {
          proceedToOppsummeringSteg();
        },
      });
    });
  }

  function saveIfChangesAndExit() {
    startExitAndContinueLaterTransition(() => {
      startLagreUtkastIfChanges({
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
    scrollToVeiviserTop();
  }

  function goBackToFyllUtPlanSteg() {
    startTransition(() => {
      setVeiviserSteg(VeiviserSteg.FYLL_UT_PLAN);
    });
    scrollToVeiviserTop();
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

function scrollToVeiviserTop() {
  const HEIGHT_DECORATOR = 160;
  const HEIGHT_DINE_SYKMELDTE_HEADER = 128;

  window.scrollTo({
    top: HEIGHT_DECORATOR + HEIGHT_DINE_SYKMELDTE_HEADER,
    behavior: "smooth",
  });
}
