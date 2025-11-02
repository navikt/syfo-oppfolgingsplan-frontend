import { oppfolgingsplanFormDefaultValues } from "../FyllUtPlanSteg/form/form-options";
import { withForm } from "../FyllUtPlanSteg/form/hooks/form";

interface Props {
  foo?: string;
}

const OppsummeringSteg = withForm({
  defaultValues: oppfolgingsplanFormDefaultValues,
  props: {} as Props,
  render: ({ form }) => {
    return (
      <form.Subscribe selector={(state) => state.values}>
        {(values) => <pre>{JSON.stringify(values, null, 2)}</pre>}
      </form.Subscribe>
    );
  },
});

export default OppsummeringSteg;
