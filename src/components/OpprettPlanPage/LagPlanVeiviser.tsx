"use client";

import { Activity, use } from "react";
import { UtkastData } from "@/server/fetchData/fetchUtkastPlan";
import FyllUtPlanSteg from "./FyllUtPlanSteg/FyllUtPlanSteg";
import useOppfolgingsplanForm from "./FyllUtPlanSteg/form/hooks/useOppfolgingsplanForm";
import OppsummeringSteg from "./OppsummeringSteg/OppsummeringSteg";

export enum VeiviserSteg {
  FYLL_UT_PLAN = "FYLL_UT_PLAN",
  OPPSUMMERING = "OPPSUMMERING",
}

interface Props {
  lagretUtkastPromise: Promise<UtkastData>;
}

export default function LagPlanVeiviser({ lagretUtkastPromise }: Props) {
  const { savedFormValues, lastSavedTime } = use(lagretUtkastPromise);

  const {
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
  } = useOppfolgingsplanForm({
    initialSavedValues: savedFormValues,
    initialLastSavedTime: lastSavedTime,
  });

  return (
    <section>
      <Activity
        mode={veiviserSteg === VeiviserSteg.FYLL_UT_PLAN ? "visible" : "hidden"}
      >
        <FyllUtPlanSteg
          form={form}
          isSavingUtkast={isSavingUtkast}
          isPendingProceedToOppsummering={isPendingProceedToOppsummering}
          isPendingExitAndContinueLater={isPendingExitAndContinueLater}
          sistLagretUtkastTidspunkt={utkastLastSavedTime}
          errorSummaryRef={focusThisOnValidationErrorsRef}
          onAvsluttOgFortsettSenereClick={saveIfChangesAndExit}
          onGoToOppsummeringClick={() =>
            form.handleSubmit({ submitAction: "fortsettTilOppsummering" })
          }
        />
      </Activity>

      <Activity
        mode={veiviserSteg === VeiviserSteg.OPPSUMMERING ? "visible" : "hidden"}
      >
        <OppsummeringSteg
          form={form}
          isPendingFerdigstillPlan={isPendingFerdigstillPlan}
          onGoBack={goBackToFyllUtPlanSteg}
          onFerdigstillPlanClick={() =>
            form.handleSubmit({ submitAction: "ferdigstill" })
          }
        />
      </Activity>
    </section>
  );
}
