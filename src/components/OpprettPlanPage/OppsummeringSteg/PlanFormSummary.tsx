import { Box, FormSummary } from "@navikt/ds-react";
import { OppfolgingsplanForm } from "@/schema/oppfolgingsplanFormSchemas";
import { formHeadings, formLabels } from "../form-labels";

interface Props {
  formValues: OppfolgingsplanForm;
  onEditPlan: () => void;
  className?: string;
}

export default function PlanFormSummary({ formValues, className }: Props) {
  return (
    <Box.New className={className}>
      {/* whitespace-pre-line er for å vise linjeskift i brukers svar */}
      <FormSummary className="mb-8 whitespace-pre-line">
        <FormSummary.Header>
          <FormSummary.Heading level="3">
            {formHeadings.arbeidsoppgaver}
          </FormSummary.Heading>
        </FormSummary.Header>

        <FormSummary.Answers>
          <FormSummary.Answer>
            <FormSummary.Label>
              {formLabels.typiskArbeidshverdag.label}
            </FormSummary.Label>
            <FormSummary.Value>
              {formValues.typiskArbeidshverdag}
            </FormSummary.Value>
          </FormSummary.Answer>

          <FormSummary.Answer>
            <FormSummary.Label>
              {formLabels.arbeidsoppgaverSomKanUtfores.label}
            </FormSummary.Label>
            <FormSummary.Value>
              {formValues.arbeidsoppgaverSomKanUtfores}
            </FormSummary.Value>
          </FormSummary.Answer>

          <FormSummary.Answer>
            <FormSummary.Label>
              {formLabels.arbeidsoppgaverSomIkkeKanUtfores.label}
            </FormSummary.Label>
            <FormSummary.Value>
              {formValues.arbeidsoppgaverSomIkkeKanUtfores}
            </FormSummary.Value>
          </FormSummary.Answer>
        </FormSummary.Answers>
      </FormSummary>

      <FormSummary>
        <FormSummary.Header>
          <FormSummary.Heading level="3">
            {formHeadings.tilrettelegging}
          </FormSummary.Heading>
        </FormSummary.Header>

        <FormSummary.Answers>
          <FormSummary.Answer>
            <FormSummary.Label>
              {formLabels.tidligereTilrettelegging.label}
            </FormSummary.Label>
            <FormSummary.Value>
              {formValues.tidligereTilrettelegging}
            </FormSummary.Value>
          </FormSummary.Answer>

          <FormSummary.Answer>
            <FormSummary.Label>
              {formLabels.tilretteleggingFremover.label}
            </FormSummary.Label>
            <FormSummary.Value>
              {formValues.tilretteleggingFremover}
            </FormSummary.Value>
          </FormSummary.Answer>

          <FormSummary.Answer>
            <FormSummary.Label>
              {formLabels.annenTilrettelegging.label}
            </FormSummary.Label>
            <FormSummary.Value>
              {formValues.annenTilrettelegging}
            </FormSummary.Value>
          </FormSummary.Answer>

          <FormSummary.Answer>
            <FormSummary.Label>
              {formLabels.hvordanFolgeOpp.label}
            </FormSummary.Label>
            <FormSummary.Value>{formValues.hvordanFolgeOpp}</FormSummary.Value>
          </FormSummary.Answer>

          <FormSummary.Answer>
            <FormSummary.Label>
              {formLabels.evalueringsDato.label}
            </FormSummary.Label>
            <FormSummary.Value>
              {formValues.evalueringsDato &&
                new Date(formValues.evalueringsDato).toLocaleDateString(
                  "nb-NO",
                  {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  },
                )}
            </FormSummary.Value>
          </FormSummary.Answer>

          <FormSummary.Answer>
            <FormSummary.Label>
              {formLabels.harDenAnsatteMedvirket.label}
            </FormSummary.Label>
            <FormSummary.Value>
              {formValues.harDenAnsatteMedvirket === "ja" ? "Ja" : "Nei"}
            </FormSummary.Value>
          </FormSummary.Answer>

          {formValues.harDenAnsatteMedvirket === "nei" && (
            <FormSummary.Answer>
              <FormSummary.Label>
                {formLabels.denAnsatteHarIkkeMedvirketBegrunnelse.label}
              </FormSummary.Label>
              <FormSummary.Value>
                {formValues.denAnsatteHarIkkeMedvirketBegrunnelse}
              </FormSummary.Value>
            </FormSummary.Answer>
          )}
        </FormSummary.Answers>
      </FormSummary>
    </Box.New>
  );
}
