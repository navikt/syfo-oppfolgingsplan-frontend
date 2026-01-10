import z from "zod";
import { BodyLong, Heading } from "@navikt/ds-react";
import { oppfolgingsplanFormUtfylltSchema } from "@/schema/oppfolgingsplanForm/formValidationSchemas";
import { FetchResultError } from "@/server/tokenXFetch/FetchResult";
import { FetchErrorAlert } from "@/ui/FetchErrorAlert";
import { oppfolgingsplanFormDefaultValues } from "../FyllUtPlanSteg/form/form-options";
import { withForm } from "../FyllUtPlanSteg/form/hooks/form";
import NarDuFerdigstillerPlanenAlert from "./NarDuFerdigstillerPlanenAlert";
import OppsummeringButtons from "./OppsummeringButtons";
import PlanFormSummary from "./PlanFormSummary";

interface Props {
  isPendingFerdigstillPlan: boolean;
  onGoBack: () => void;
  onFerdigstillPlanClick: () => void;
  ferdigstillPlanError: FetchResultError | null;
}

const OppsummeringSteg = withForm({
  defaultValues: oppfolgingsplanFormDefaultValues,
  props: {} as Props,
  render: ({
    form,
    isPendingFerdigstillPlan,
    onGoBack,
    onFerdigstillPlanClick,
    ferdigstillPlanError,
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
            <PlanFormSummary
              // When the user is here, the form values are valid
              formValues={
                formValues as z.infer<typeof oppfolgingsplanFormUtfylltSchema>
              }
              onEditPlan={onGoBack}
              className="mb-8"
            />
          )}
        </form.Subscribe>

        <NarDuFerdigstillerPlanenAlert className="mb-12" />

        <OppsummeringButtons
          isPendingFerdigstill={isPendingFerdigstillPlan}
          onFerdigstillPlanClick={onFerdigstillPlanClick}
          onGoBackClick={onGoBack}
        />

        <FetchErrorAlert
          error={ferdigstillPlanError}
          fallbackMessage="Vi klarte ikke å ferdigstille planen. Vennligst prøv igjen senere."
          className="mt-4"
        />
      </section>
    );
  },
});

export default OppsummeringSteg;
