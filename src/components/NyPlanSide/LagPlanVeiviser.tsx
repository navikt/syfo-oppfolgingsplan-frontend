"use client";

import { Activity, use } from "react";
import { ConvertedLagretUtkastData } from "@/schema/utkastResponseSchema";
import FyllUtPlanSteg from "./FyllUtPlanSteg/FyllUtPlanSteg";
import useOppfolgingsplanForm from "./FyllUtPlanSteg/form/hooks/useOppfolgingsplanForm";
import OppsummeringSteg from "./OppsummeringSteg/OppsummeringSteg";

export enum VeiviserSteg {
  FYLL_UT_PLAN = "FYLL_UT_PLAN",
  OPPSUMMERING = "OPPSUMMERING",
}

interface Props {
  lagretUtkastPromise: Promise<ConvertedLagretUtkastData>;
}

export default function LagPlanVeiviser({ lagretUtkastPromise }: Props) {
  const { utkast } = use(lagretUtkastPromise);

  const initialLagretUtkast = utkast?.content || null;
  const initialSistLagretTidspunkt = utkast?.sistLagretTidspunkt || null;

  const {
    form,
    veiviserSteg,
    focusThisOnValidationErrorsRef,
    isSavingUtkast,
    utkastSistLagretTidspunkt,
    isPendingProceedToOppsummering,
    isPendingExitAndContinueLater,
    isPendingFerdigstillPlan,
    saveIfChangesAndExit,
    goBackToFyllUtPlanSteg,
    saveUtkastError,
    ferdigstillPlanError,
  } = useOppfolgingsplanForm({
    initialLagretUtkast,
    initialSistLagretTidspunkt,
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
          utkastSistLagretTidspunkt={utkastSistLagretTidspunkt}
          errorSummaryRef={focusThisOnValidationErrorsRef}
          onAvsluttOgFortsettSenereClick={saveIfChangesAndExit}
          onGoToOppsummeringClick={() =>
            form.handleSubmit({ submitAction: "fortsettTilOppsummering" })
          }
          error={saveUtkastError}
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
          error={ferdigstillPlanError}
        />
      </Activity>
    </section>
  );
}
