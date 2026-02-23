import { ErrorSummary } from "@navikt/ds-react";
import type z from "zod";
import { formLabels } from "../../form-labels";
import { oppfolgingsplanFormDefaultValues } from "./form-options";
import { withForm } from "./hooks/form";

type ErrorMapWithZodIssues = Record<string, Array<z.core.$ZodIssue>>;

function isFormLabelsKey(fieldId: string): fieldId is keyof typeof formLabels {
  return Object.hasOwn(formLabels, fieldId);
}

function getLabelForFormField(fieldId: string) {
  if (!isFormLabelsKey(fieldId)) return null;
  return formLabels[fieldId].label;
}

interface Props {
  errorSummaryRef: React.RefObject<HTMLDivElement | null>;
}

export const FormErrorSummary = withForm({
  defaultValues: oppfolgingsplanFormDefaultValues,
  props: {} as Props,
  render: function Render({ form, errorSummaryRef }) {
    return (
      <form.Subscribe
        selector={(state) =>
          state.errorMap.onDynamic as ErrorMapWithZodIssues | undefined
        }
      >
        {(errorMap) => {
          if (!errorMap || Object.keys(errorMap).length === 0) {
            return null;
          }

          const errorMapEntries = Object.entries(errorMap);
          const fieldIdAndErrorMessages = errorMapEntries.map(
            ([fieldId, errors]) => ({
              fieldId,
              errorMessages: errors.map((error) => error.message),
            }),
          );

          const errorSummaryItemData = fieldIdAndErrorMessages.flatMap(
            ({ fieldId, errorMessages }) =>
              errorMessages.map((errorMessage) => ({
                fieldId,
                fieldLabel: getLabelForFormField(fieldId),
                errorMessage,
              })),
          );

          return (
            <ErrorSummary
              ref={errorSummaryRef}
              heading="Du må gjøre dette før du kan gå videre:"
            >
              {errorSummaryItemData.map(
                ({ fieldId, errorMessage, fieldLabel }, index) => (
                  <ErrorSummary.Item key={index} href={`#${fieldId}`}>
                    {errorMessage}
                    {fieldLabel ? ` - ${fieldLabel}` : ""}
                  </ErrorSummary.Item>
                ),
              )}
            </ErrorSummary>
          );
        }}
      </form.Subscribe>
    );
  },
});

export default FormErrorSummary;
