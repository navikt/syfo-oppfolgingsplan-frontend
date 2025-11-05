import { Button } from "@navikt/ds-react";
import { oppfolgingsplanFormDefaultValues } from "../FyllUtPlanSteg/form/form-options";
import { withForm } from "../FyllUtPlanSteg/form/hooks/form";

interface Props {
  onGoBackClick: () => void;
}

const OppsummeringSteg = withForm({
  defaultValues: oppfolgingsplanFormDefaultValues,
  props: {} as Props,
  render: ({ form, onGoBackClick }) => {
    return (
      <section>
        <form.Subscribe selector={(state) => state.values}>
          {(values) => <pre>{JSON.stringify(values, null, 2)}</pre>}
        </form.Subscribe>
        <Button variant="secondary" onClick={onGoBackClick}>
          Tilbake
        </Button>
      </section>
    );
  },
});

export default OppsummeringSteg;
