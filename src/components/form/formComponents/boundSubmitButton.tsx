import { useFormContext } from "@/components/form/hooks/form-context.tsx";
import { Button } from "@navikt/ds-react";

export const BoundSubmitButton = ({ label }: { label: string }) => {
  const form = useFormContext();
  return (
    <form.Subscribe selector={(state) => state.isSubmitting}>
      {(isSubmitting) => (
        <Button type="submit" variant="primary" disabled={isSubmitting}>
          {label}
        </Button>
      )}
    </form.Subscribe>
  );
};
