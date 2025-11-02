import { BodyLong, Heading } from "@navikt/ds-react";
import { oppfolgingsplanFormDefaultValues } from "../FyllUtPlanSteg/form/form-options";
import { withForm } from "../FyllUtPlanSteg/form/hooks/form";
import NarDuFerdigstillerPlanenAlert from "./NarDuFerdigstillerPlanenAlert";
import OppsummeringButtons from "./OppsummeringButtons";
import PlanFormSummary from "./PlanFormSummary";

interface Props {
  isPendingFerdigstillPlan: boolean;
  onGoBack: () => void;
  onFerdigstillPlanClick: () => void;
}

const OppsummeringSteg = withForm({
  defaultValues: oppfolgingsplanFormDefaultValues,
  props: {} as Props,
  render: ({
    form,
    isPendingFerdigstillPlan,
    onGoBack,
    onFerdigstillPlanClick,
  }) => {
    return (
      <section>
        <Heading level="3" size="medium" spacing>
          Oppsummering
        </Heading>

        <BodyLong spacing>
          Se over at alt stemmer, og del planen med den ansatte når du er klar.
        </BodyLong>

        <form.Subscribe selector={(state) => state.values}>
          {(formValues) => (
            <PlanFormSummary formValues={formValues} onEditPlan={onGoBack} />
          )}
        </form.Subscribe>

        <NarDuFerdigstillerPlanenAlert />

        <OppsummeringButtons
          isPendingFerdigstill={isPendingFerdigstillPlan}
          onFerdigstillPlanClick={onFerdigstillPlanClick}
          onGoBackClick={onGoBack}
        />
      </section>
    );
  },
});

export default OppsummeringSteg;
