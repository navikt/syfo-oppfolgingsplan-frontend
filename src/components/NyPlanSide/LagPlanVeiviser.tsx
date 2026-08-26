"use client";

import { Activity, use } from "react";
import {
  fyllUtPlanSkjemaFullfortEvent,
  fyllUtPlanSkjemaStegFullfortEvent,
} from "@/common/analytics/events-and-properties/skjema-events";
import { logAnalyticsEvent } from "@/common/analytics/logAnalyticsEvent";
import type { ConvertedLagretUtkastResponse } from "@/schema/utkastResponseSchema";
import FyllUtPlanSteg from "./FyllUtPlanSteg/FyllUtPlanSteg";
import useOppfolgingsplanForm from "./FyllUtPlanSteg/form/hooks/useOppfolgingsplanForm";
import OppsummeringSteg from "./OppsummeringSteg/OppsummeringSteg";

export enum VeiviserSteg {
  FYLL_UT_PLAN = "FYLL_UT_PLAN",
  OPPSUMMERING = "OPPSUMMERING",
}

interface Props {
  lagretUtkastPromise: Promise<ConvertedLagretUtkastResponse>;
  erITiltaksgruppePromise: Promise<boolean>;
}

export default function LagPlanVeiviser({
  lagretUtkastPromise,
  erITiltaksgruppePromise,
}: Props) {
  const { userHasEditAccess, utkast } = use(lagretUtkastPromise);
  const erITiltaksgruppe = use(erITiltaksgruppePromise);

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
    lagreUtkastError,
    ferdigstillPlanError,
  } = useOppfolgingsplanForm({
    initialLagretUtkast,
    initialSistLagretTidspunkt,
    erITiltaksgruppe,
  });

  function handleFortsettTilOppsummering() {
    logAnalyticsEvent(fyllUtPlanSkjemaStegFullfortEvent);
    form.handleSubmit({ submitAction: "fortsettTilOppsummering" });
  }

  function handleFerdigstillPlan() {
    logAnalyticsEvent(fyllUtPlanSkjemaFullfortEvent);
    form.handleSubmit({ submitAction: "ferdigstill" });
  }

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
          onAvsluttOgFortsettSenereClick={() => {
            saveIfChangesAndExit();
          }}
          onGoToOppsummeringClick={handleFortsettTilOppsummering}
          isFormReadOnly={!userHasEditAccess}
          lagreUtkastError={lagreUtkastError}
          erITiltaksgruppe={erITiltaksgruppe}
        />
      </Activity>

      <Activity
        mode={veiviserSteg === VeiviserSteg.OPPSUMMERING ? "visible" : "hidden"}
      >
        <OppsummeringSteg
          form={form}
          isPendingFerdigstillPlan={isPendingFerdigstillPlan}
          onGoBack={goBackToFyllUtPlanSteg}
          onFerdigstillPlanClick={handleFerdigstillPlan}
          ferdigstillPlanError={ferdigstillPlanError}
          erITiltaksgruppe={erITiltaksgruppe}
        />
      </Activity>
    </section>
  );
}
