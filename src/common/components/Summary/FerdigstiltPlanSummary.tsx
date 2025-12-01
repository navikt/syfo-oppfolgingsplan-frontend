import { FormSummary, VStack } from "@navikt/ds-react";
import {
  FormSummaryAnswer,
  FormSummaryAnswers,
  FormSummaryHeader,
  FormSummaryHeading,
  FormSummaryLabel,
  FormSummaryValue,
} from "@navikt/ds-react/FormSummary";
import { formHeadings, formLabels } from "@/common/form-labels";
import { OppfolgingsplanForm } from "@/schema/oppfolgingsplanFormSchemas";

// TODO: Rewrite for FormSnapshot

interface Props {
  planContent: OppfolgingsplanForm;
}

export default function FerdigstiltPlanSummary({
  planContent: formValues,
}: Props) {
  return (
    <VStack>
      {/* whitespace-pre-line er for å vise linjeskift i brukers svar */}
      <FormSummary className="mb-8 whitespace-pre-line">
        <FormSummaryHeader>
          <FormSummaryHeading level="3">
            {formHeadings.arbeidsoppgaver}
          </FormSummaryHeading>
        </FormSummaryHeader>

        <FormSummaryAnswers>
          <FormSummaryAnswer>
            <FormSummaryLabel>
              {formLabels.typiskArbeidshverdag.label}
            </FormSummaryLabel>
            <FormSummaryValue>
              {formValues.typiskArbeidshverdag}
            </FormSummaryValue>
          </FormSummaryAnswer>

          <FormSummaryAnswer>
            <FormSummaryLabel>
              {formLabels.arbeidsoppgaverSomKanUtfores.label}
            </FormSummaryLabel>
            <FormSummaryValue>
              {formValues.arbeidsoppgaverSomKanUtfores}
            </FormSummaryValue>
          </FormSummaryAnswer>

          <FormSummaryAnswer>
            <FormSummaryLabel>
              {formLabels.arbeidsoppgaverSomIkkeKanUtfores.label}
            </FormSummaryLabel>
            <FormSummaryValue>
              {formValues.arbeidsoppgaverSomIkkeKanUtfores}
            </FormSummaryValue>
          </FormSummaryAnswer>
        </FormSummaryAnswers>
      </FormSummary>

      <FormSummary>
        <FormSummaryHeader>
          <FormSummaryHeading level="3">
            {formHeadings.tilrettelegging}
          </FormSummaryHeading>
        </FormSummaryHeader>

        <FormSummaryAnswers>
          <FormSummaryAnswer>
            <FormSummaryLabel>
              {formLabels.tidligereTilrettelegging.label}
            </FormSummaryLabel>
            <FormSummaryValue>
              {formValues.tidligereTilrettelegging}
            </FormSummaryValue>
          </FormSummaryAnswer>

          <FormSummaryAnswer>
            <FormSummaryLabel>
              {formLabels.tilretteleggingFremover.label}
            </FormSummaryLabel>
            <FormSummaryValue>
              {formValues.tilretteleggingFremover}
            </FormSummaryValue>
          </FormSummaryAnswer>

          <FormSummaryAnswer>
            <FormSummaryLabel>
              {formLabels.annenTilrettelegging.label}
            </FormSummaryLabel>
            <FormSummaryValue>
              {formValues.annenTilrettelegging}
            </FormSummaryValue>
          </FormSummaryAnswer>

          <FormSummaryAnswer>
            <FormSummaryLabel>
              {formLabels.hvordanFolgeOpp.label}
            </FormSummaryLabel>
            <FormSummaryValue>{formValues.hvordanFolgeOpp}</FormSummaryValue>
          </FormSummaryAnswer>

          <FormSummaryAnswer>
            <FormSummaryLabel>
              {formLabels.evalueringsDato.label}
            </FormSummaryLabel>
            <FormSummaryValue>
              {formValues.evalueringsDato &&
                new Date(formValues.evalueringsDato).toLocaleDateString(
                  "nb-NO",
                  {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  },
                )}
            </FormSummaryValue>
          </FormSummaryAnswer>

          <FormSummaryAnswer>
            <FormSummaryLabel>
              {formLabels.harDenAnsatteMedvirket.label}
            </FormSummaryLabel>
            <FormSummaryValue>
              {formValues.harDenAnsatteMedvirket === "ja" ? "Ja" : "Nei"}
            </FormSummaryValue>
          </FormSummaryAnswer>

          {formValues.harDenAnsatteMedvirket === "nei" && (
            <FormSummaryAnswer>
              <FormSummaryLabel>
                {formLabels.denAnsatteHarIkkeMedvirketBegrunnelse.label}
              </FormSummaryLabel>
              <FormSummaryValue>
                {formValues.denAnsatteHarIkkeMedvirketBegrunnelse}
              </FormSummaryValue>
            </FormSummaryAnswer>
          )}
        </FormSummaryAnswers>
      </FormSummary>
    </VStack>
  );
}
