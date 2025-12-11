import z from "zod";
import { Alert, BodyLong, Heading } from "@navikt/ds-react";
import { OppfolgingsplanFormFerdigstillSchema } from "@/schema/oppfolgingsplanFormSchemas";
import { FetchResultError } from "@/server/tokenXFetch/FetchResult";
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
                formValues as z.infer<
                  typeof OppfolgingsplanFormFerdigstillSchema
                >
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

        {ferdigstillPlanError && (
          <div className="mt-4">
            <Alert variant="error">
              Vi klarte ikke å ferdigstille planen. Vennligst prøv igjen senere.
            </Alert>
          </div>
        )}
      </section>
    );
  },
});

export default OppsummeringSteg;
