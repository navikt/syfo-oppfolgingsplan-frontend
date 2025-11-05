"use client";

import { Activity, startTransition, use, useState, useTransition } from "react";
import { UtkastData } from "@/server/fetchData/fetchUtkastPlan";
import FyllUtPlanSteg from "./FyllUtPlanSteg/FyllUtPlanSteg";
import useOppfolgingsplanForm from "./FyllUtPlanSteg/form/hooks/useOppfolgingsplanForm";
import useOppfolgingsplanLagring from "./FyllUtPlanSteg/form/hooks/useOppfolgingsplanLagring";
import OppsummeringSteg from "./OppsummeringSteg/OppsummeringSteg";

enum Steg {
  FYLL_UT_PLAN = "FYLL_UT_PLAN",
  OPPSUMMERING = "OPPSUMMERING",
}

interface Props {
  lagretUtkastPromise: Promise<UtkastData>;
}

export default function LagPlanVeiviser({ lagretUtkastPromise }: Props) {
  const { lagretUtkast, sistLagretTid } = use(lagretUtkastPromise);

  const { form, validateAndSubmitIfValid, focusThisOnValidationErrorsRef } =
    useOppfolgingsplanForm({
      initialValues: lagretUtkast,
      onDebouncedChange: autolagreUtkast,
      onSubmitAfterValidationPassed:
        lagreUtkastHvisEndringerOgGaTilOppsummering,
    });

  const {
    isSavingUtkast,
    utkastLastSavedTime,
    autoLagreUtkastAction,
    lagreUtkastHvisEndringer,
  } = useOppfolgingsplanLagring(lagretUtkast, sistLagretTid);

  const [isGoingToOppsummering, startGoToOppsummeringTransition] =
    useTransition();

  function autolagreUtkast() {
    if (steg === Steg.FYLL_UT_PLAN && !isGoingToOppsummering) {
      startTransition(() => {
        autoLagreUtkastAction(form.state.values);
      });
    }
  }

  console.log("Rerender LagPlanVeiviser");

  async function lagreUtkastHvisEndringerOgGaTilOppsummering() {
    startGoToOppsummeringTransition(async () => {
      await lagreUtkastHvisEndringer(form.state.values);
      setSteg(Steg.OPPSUMMERING);
    });
  }

  const handleGoBackToRedigering = () => {
    setSteg(Steg.FYLL_UT_PLAN);
  };

  const [steg, setSteg] = useState(Steg.FYLL_UT_PLAN);

  return (
    <section>
      <Activity mode={steg === Steg.FYLL_UT_PLAN ? "visible" : "hidden"}>
        <FyllUtPlanSteg
          form={form}
          isSavingUtkast={isSavingUtkast}
          isGoingToOppsummering={isGoingToOppsummering}
          sistLagretUtkastTidspunkt={utkastLastSavedTime}
          errorSummaryRef={focusThisOnValidationErrorsRef}
          onAvsluttOgFortsettSenereClick={async () => {}}
          onGoToOppsummeringClick={validateAndSubmitIfValid}
        />
      </Activity>

      <Activity mode={steg === Steg.OPPSUMMERING ? "visible" : "hidden"}>
        <OppsummeringSteg
          form={form}
          onGoBackClick={handleGoBackToRedigering}
        />
      </Activity>
    </section>
  );
}
