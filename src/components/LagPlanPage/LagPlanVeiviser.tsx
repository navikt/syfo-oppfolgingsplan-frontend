"use client";

import { Activity, use, useState } from "react";
import { OppfolgingsplanForm } from "@/schema/oppfolgingsplanFormSchemas";
import FyllUtPlanSteg from "./FyllUtPlanSteg/FyllUtPlanSteg";
import useOppfolgingsplanForm from "./FyllUtPlanSteg/form/hooks/useOppfolgingsplanForm";
import useOppfolgingsplanLagring from "./FyllUtPlanSteg/form/hooks/useOppfolgingsplanLagring";
import OppsummeringSteg from "./OppsummeringSteg/OppsummeringSteg";

enum Steg {
  FYLL_UT_PLAN = "FYLL_UT_PLAN",
  OPPSUMMERING = "OPPSUMMERING",
}

interface Props {
  lagretUtkast: Promise<Partial<OppfolgingsplanForm> | null>;
}

export default function LagPlanVeiviser({ lagretUtkast }: Props) {
  const lagretUtkastToBeInitialFormValues = use(lagretUtkast);

  const {
    form,
    triggerValidationAndGetIsValid,
    focusThisOnValidationErrorsRef,
  } = useOppfolgingsplanForm({
    initialValues: lagretUtkastToBeInitialFormValues,
    onDebouncedChange: handleAutolagreUtkastHvisEndringer,
  });

  const {
    autolagreUtkastHvisEndringer,
    skruAvAutoLagringOgLagreUtkast,
    ferdigstillPlan,
    isSavingUtkast,
    utkastSistLagretTid,
  } = useOppfolgingsplanLagring();

  function handleAutolagreUtkastHvisEndringer() {
    autolagreUtkastHvisEndringer(form.state.values);
  }

  async function lagreUtkastAndGoToOppsummeringIfValid() {
    const isValid = triggerValidationAndGetIsValid();

    if (isValid) {
      await skruAvAutoLagringOgLagreUtkast(form.state.values);
      setSteg(Steg.OPPSUMMERING);
    }
  }

  const [steg, setSteg] = useState(Steg.FYLL_UT_PLAN);

  return (
    <section>
      <Activity mode={steg === Steg.FYLL_UT_PLAN ? "visible" : "hidden"}>
        <FyllUtPlanSteg
          form={form}
          isSavingUtkast={isSavingUtkast}
          sistLagretUtkastTidspunkt={utkastSistLagretTid}
          errorSummaryRef={focusThisOnValidationErrorsRef}
          onAvsluttOgFortsettSenereClick={async () => {}}
          onGoToOppsummeringClick={lagreUtkastAndGoToOppsummeringIfValid}
        />
      </Activity>

      <Activity mode={steg === Steg.OPPSUMMERING ? "visible" : "hidden"}>
        <OppsummeringSteg form={form} />
      </Activity>
    </section>
  );
}
