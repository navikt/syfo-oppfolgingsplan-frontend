import { revalidateLogic } from "@tanstack/react-form";
import { useParams, useRouter } from "next/navigation";
import { startTransition, useRef, useState, useTransition } from "react";
import type z from "zod";
import { SAVE_UTKAST_DEBOUNCE_DELAY } from "@/common/app-config";
import { getAGOversiktHref } from "@/common/route-hrefs";
import { VeiviserSteg } from "@/components/NyPlanSide/LagPlanVeiviser";
import {
  type OppfolgingsplanFormUnderArbeid,
  oppfolgingsplanFormUtfylltSchema,
} from "@/schema/oppfolgingsplanForm/formValidationSchemas";
import { scrollToAppTopForAG } from "@/utils/scrollToAppTop";
import { oppfolgingsplanFormDefaultValues } from "../form-options";
import { useAppForm } from "./form";
import useFerdigstillOppfolgingsplanAction from "./useFerdigstillOppfolgingsplanAction";
import useOppfolgingsplanUtkastLagring from "./useOppfolgingsplanUtkastLagring";

type FormMeta = {
  submitAction: "fortsettTilOppsummering" | "ferdigstill";
};

const defaultMeta: FormMeta = {
  submitAction: "fortsettTilOppsummering",
};

export default function useOppfolgingsplanForm({
  initialLagretUtkast,
  initialSistLagretTidspunkt,
}: {
  initialLagretUtkast: OppfolgingsplanFormUnderArbeid | null;
  initialSistLagretTidspunkt: string | null;
}) {
  const { narmesteLederId } = useParams<{ narmesteLederId: string }>();

  const [veiviserSteg, setVeiviserSteg] = useState(VeiviserSteg.FYLL_UT_PLAN);

  const [isPendingProceedToOppsummering, startProceedToOppsummeringTransition] =
    useTransition();
  const [isPendingExitAndContinueLater, startExitAndContinueLaterTransition] =
    useTransition();

  const focusThisOnValidationErrorsRef = useRef<HTMLDivElement>(null);

  const { push } = useRouter();

  const initialFormValues: OppfolgingsplanFormUnderArbeid = {
    ...oppfolgingsplanFormDefaultValues,
    ...initialLagretUtkast,
  };

  const form = useAppForm({
    defaultValues: initialFormValues,
    validationLogic: revalidateLogic(),
    validators: {
      onDynamic: oppfolgingsplanFormUtfylltSchema,
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
        startFerdigstillPlanAction({
          // We know the form is valid when onSubmit runs, so we can
          // safely assert the type, and that evalueringsDato is defined
          formValues: value as z.infer<typeof oppfolgingsplanFormUtfylltSchema>,
          evalueringsDatoIsoString: value.evalueringsDato ?? "",
          includeIkkeMedvirketBegrunnelseFieldInFormSnapshot:
            value.harDenAnsatteMedvirket === "nei",
        });
      }
    },
  });

  const {
    isSavingUtkast,
    lagreUtkastError,
    sistLagretTidspunkt,
    startLagreUtkastIfChanges,
  } = useOppfolgingsplanUtkastLagring({
    initialFormValues,
    initialSistLagretTidspunkt,
  });

  const {
    startFerdigstillPlanAction,
    isPendingFerdigstillPlan,
    error: ferdigstillPlanError,
  } = useFerdigstillOppfolgingsplanAction();

  function saveIfChangesAndProceedToOppsummering(
    values: OppfolgingsplanFormUnderArbeid,
  ) {
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
    scrollToAppTopForAG();
  }

  function goBackToFyllUtPlanSteg() {
    startTransition(() => {
      setVeiviserSteg(VeiviserSteg.FYLL_UT_PLAN);
    });
    scrollToAppTopForAG();
  }

  return {
    form,
    veiviserSteg,
    focusThisOnValidationErrorsRef,
    isSavingUtkast,
    utkastSistLagretTidspunkt: sistLagretTidspunkt,
    isPendingProceedToOppsummering,
    isPendingExitAndContinueLater,
    isPendingFerdigstillPlan,
    saveIfChangesAndExit,
    goBackToFyllUtPlanSteg,
    lagreUtkastError,
    ferdigstillPlanError,
  };
}
