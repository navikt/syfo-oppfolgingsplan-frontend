import { FormSummary } from "@navikt/ds-react";
import {
  FormSummaryAnswer,
  FormSummaryAnswers,
  FormSummaryHeader,
  FormSummaryHeading,
  FormSummaryLabel,
  FormSummaryValue,
} from "@navikt/ds-react/FormSummary";
import {
  getLocaleDateAndTimeString,
  getLocaleDateString,
} from "@/ui-helpers/dateAndTime";
import { FormSnapshot } from "./schemas/FormSnapshot";

interface Props {
  formSnapshot: FormSnapshot;
}

type FormSnapshotField = FormSnapshot["sections"][number]["fields"][number];

export function FormSummaryFromSnapshot({ formSnapshot }: Props) {
  return formSnapshot.sections.map((section) => (
    <>
      <FormSummary className="mb-8 whitespace-pre-line" key={section.sectionId}>
        <FormSummaryHeader>
          <FormSummaryHeading level="3">
            {section.sectionTitle}
          </FormSummaryHeading>
        </FormSummaryHeader>

        <FormSummaryAnswers>
          {section.fields.map((field) => (
            <FormSummaryAnswer key={field.fieldId}>
              <FormSummaryLabel>{field.label}</FormSummaryLabel>
              <FormSummaryValue>
                {getFieldSummaryTextValue(field)}
              </FormSummaryValue>
            </FormSummaryAnswer>
          ))}
        </FormSummaryAnswers>
      </FormSummary>
    </>
  ));
}

function getFieldSummaryTextValue(field: FormSnapshotField) {
  switch (field.fieldType) {
    case "TEXT":
      return field.value;

    case "RADIO_GROUP": {
      const selectedOption = field.options.find(
        (option) => option.optionId === field.selectedOptionId,
      );
      return selectedOption?.optionLabel ?? <em>Ikke valgt</em>;
    }

    case "CHECKBOX_GROUP": {
      const selectedLabels = field.options
        .filter((option) => option.wasSelected)
        .map((option) => option.optionLabel);
      return (
        <ul className="list-none p-0 m-0">
          {selectedLabels.map((label) => (
            <li key={field.fieldId}>{label}</li>
          ))}
        </ul>
      );
    }

    case "CHECKBOX_SINGLE":
      return field.value ? "Ja" : "Nei";

    case "DATE":
      return field.value
        ? getLocaleDateString(new Date(field.value), "long")
        : "";

    case "DATE_TIME":
      return field.value
        ? getLocaleDateAndTimeString(new Date(field.value), "long")
        : "";

    default:
      return "";
  }
}
