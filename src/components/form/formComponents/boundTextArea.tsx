import { Textarea } from "@navikt/ds-react";
import { useFieldContext } from "@/components/form/hooks/form-context.tsx";

interface Props {
  label: string;
  description: string;
  maxLength: number;
}

export const BoundTextArea = ({ label, description, maxLength }: Props) => {
  const field = useFieldContext<string>();
  const errorMessages =
    field.state.meta.isTouched &&
    field.state.meta.errors.map((err) => err.message).join(",");

  return (
    <>
      <Textarea
        label={label}
        description={description}
        maxLength={maxLength}
        value={field.state.value}
        error={errorMessages}
        onChange={(e) => field.handleChange(e.target.value)}
      />
    </>
  );
};
