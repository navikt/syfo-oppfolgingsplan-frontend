import { ErrorSummary } from "@navikt/ds-react";
import { OppfolgingsplanForm } from "@/schema/oppfolgingsplanFormSchemas";
import { formLabels } from "../form-labels";
import { oppfolgingsplanFormDefaultValues } from "./form-options";
import { withForm } from "./hooks/form";

interface Props {
  errorSummaryRef: React.RefObject<HTMLDivElement | null>;
}

export const FormErrorSummary = withForm({
  defaultValues: oppfolgingsplanFormDefaultValues,
  props: {} as Props,
  render: function Render({ form, errorSummaryRef }) {
    function getLabelForFormField(fieldName: keyof OppfolgingsplanForm) {
      return formLabels[fieldName]?.label ?? fieldName;
    }

    return (
      <form.Subscribe selector={(state) => state.errors}>
        {(errors) =>
          errors.length > 0 && (
            <ErrorSummary
              ref={errorSummaryRef}
              heading="Du må rette disse feilene før du kan gå videre:"
            >
              {Object.entries(form.getAllErrors().fields)
                .filter(([, error]) => error)
                .flatMap(([fieldId, error]) =>
                  (error.errors as Array<{ message?: string }>).map(
                    (singleError, index) => (
                      <ErrorSummary.Item
                        href={`#${fieldId}`}
                        key={`${fieldId}-${index}`}
                      >
                        {singleError.message} –{" "}
                        {getLabelForFormField(
                          fieldId as keyof OppfolgingsplanForm
                        )}
                      </ErrorSummary.Item>
                    )
                  )
                )}
            </ErrorSummary>
          )
        }
      </form.Subscribe>
    );
  },
});

export default FormErrorSummary;
