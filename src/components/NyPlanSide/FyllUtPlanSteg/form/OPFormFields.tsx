import { BodyLong, Heading, Link, ReadMore } from "@navikt/ds-react";
import TextContentBox from "@/components/layout/TextContentBox";
import {
  getOneYearFromNowDayDate,
  getTomorrowDayDate,
} from "@/utils/dateAndTime/dateUtils";
import { formHeadings, formLabels } from "../../form-labels";
import { oppfolgingsplanFormDefaultValues } from "./form-options";
import { withForm } from "./hooks/form";

interface Props {
  /**
   * This prop is used to "disable" input fields during "saving while exiting or proceeding" states.
   * The props `disabled` or `readOnly` on the aksel input components are not currently used
   * because they cause layout shift. The layout shift happens because the "1000 tegn igjen" text
   * is removed in these states.
   */
  isChangeDisabled: boolean;
  isReadOnly: boolean;
}

const OPFormFields = withForm({
  defaultValues: oppfolgingsplanFormDefaultValues,
  props: {} as Props,
  render: ({ form, isChangeDisabled, isReadOnly }) => (
    <>
      <TextContentBox className="mb-4">
        <Heading level="2" size="medium" spacing>
          {formHeadings.arbeidsoppgaver}
        </Heading>
      </TextContentBox>

      <form.AppField name="typiskArbeidshverdag">
        {(field) => (
          <field.FormTextArea
            label={formLabels.typiskArbeidshverdag.label}
            description={formLabels.typiskArbeidshverdag.description}
            isChangeDisabled={isChangeDisabled}
            isReadOnly={isReadOnly}
          />
        )}
      </form.AppField>

      <form.AppField name="arbeidsoppgaverSomKanUtfores">
        {(field) => (
          <field.FormTextArea
            label={formLabels.arbeidsoppgaverSomKanUtfores.label}
            isChangeDisabled={isChangeDisabled}
            isReadOnly={isReadOnly}
          />
        )}
      </form.AppField>

      <form.AppField name="arbeidsoppgaverSomIkkeKanUtfores">
        {(field) => (
          <field.FormTextArea
            label={formLabels.arbeidsoppgaverSomIkkeKanUtfores.label}
            isChangeDisabled={isChangeDisabled}
            isReadOnly={isReadOnly}
          />
        )}
      </form.AppField>

      <TextContentBox className="mb-4">
        <Heading level="2" size="medium" spacing>
          {formHeadings.tilrettelegging}
        </Heading>

        <BodyLong size="medium" spacing>
          Arbeidsgiver skal organisere arbeidet og legge til rette slik at den
          ansatte kan være i jobb. Les mer om{" "}
          <Link
            href="https://www.nav.no/arbeidsgiver/tilretteleggingsplikt"
            target="_blank"
          >
            tilrettelegging på arbeidsplassen
          </Link>{" "}
          (lenke åpner i ny fane).
        </BodyLong>
      </TextContentBox>

      <form.AppField name="tidligereTilrettelegging">
        {(field) => (
          <field.FormTextArea
            label={formLabels.tidligereTilrettelegging.label}
            description={formLabels.tidligereTilrettelegging.description}
            isChangeDisabled={isChangeDisabled}
            isReadOnly={isReadOnly}
          />
        )}
      </form.AppField>

      <form.AppField name="tilretteleggingFremover">
        {(field) => (
          <field.FormTextArea
            label={formLabels.tilretteleggingFremover.label}
            isChangeDisabled={isChangeDisabled}
            isReadOnly={isReadOnly}
          />
        )}
      </form.AppField>

      <form.AppField name="annenTilrettelegging">
        {(field) => (
          <field.FormTextArea
            label={formLabels.annenTilrettelegging.label}
            description={formLabels.annenTilrettelegging.description}
            isChangeDisabled={isChangeDisabled}
            isReadOnly={isReadOnly}
          />
        )}
      </form.AppField>

      <form.AppField name="hvordanFolgeOpp">
        {(field) => (
          <field.FormTextArea
            label={formLabels.hvordanFolgeOpp.label}
            isChangeDisabled={isChangeDisabled}
            isReadOnly={isReadOnly}
          />
        )}
      </form.AppField>

      <form.AppField name="evalueringsDato">
        {(field) => (
          <field.FormDatePicker
            label={formLabels.evalueringsDato.label}
            description={readMoreOmAEvaluerePlanen}
            fromDate={getTomorrowDayDate()}
            toDate={getOneYearFromNowDayDate()}
            isChangeDisabled={isChangeDisabled}
            isReadOnly={isReadOnly}
            className="mb-8"
          />
        )}
      </form.AppField>

      <form.AppField name="harDenAnsatteMedvirket">
        {(field) => (
          <field.FormRadioGroup
            label={formLabels.harDenAnsatteMedvirket.label}
            description={readMoreOmHvorforViSporOmDenAnsatteHarMedvirket}
            options={[
              {
                value: "ja",
                label: "Ja",
              },
              {
                value: "nei",
                label: "Nei",
              },
            ]}
            isChangeDisabled={isChangeDisabled}
            isReadOnly={isReadOnly}
            className="mb-4"
          />
        )}
      </form.AppField>

      <form.Subscribe selector={(state) => state.values.harDenAnsatteMedvirket}>
        {(harDenAnsatteMedvirket) =>
          harDenAnsatteMedvirket === "nei" && (
            <form.AppField name="denAnsatteHarIkkeMedvirketBegrunnelse">
              {(field) => (
                <field.FormTextArea
                  label={formLabels.denAnsatteHarIkkeMedvirketBegrunnelse.label}
                  description={
                    formLabels.denAnsatteHarIkkeMedvirketBegrunnelse.description
                  }
                  isChangeDisabled={isChangeDisabled}
                />
              )}
            </form.AppField>
          )
        }
      </form.Subscribe>
    </>
  ),
});

const readMoreOmAEvaluerePlanen = (
  <ReadMore header="Mer om å evaluere planen">
    <BodyLong className="mb-2">
      Etter at dere har prøvd ut de foreslåtte tilpasningene en stund, er det
      viktig å ta et steg tilbake og se hvordan det faktisk har gått. Har det
      blitt lettere å jobbe? Fungerer tilpasningene som ønsket? Eller er det
      behov for mer støtte eller justeringer?
    </BodyLong>

    <BodyLong className="mb-2">
      For å sikre at planen fortsatt er relevant og nyttig for dere, anbefaler
      vi at dere evaluerer den innen <strong>fire uker</strong>. Dette gir nok
      tid til å erfare hva som fungerer – og hva som kanskje må endres. En god
      evaluering gir dere bedre støtte og øker sjansen for en tryggere vei
      tilbake til arbeid.
    </BodyLong>
  </ReadMore>
);

const readMoreOmHvorforViSporOmDenAnsatteHarMedvirket = (
  <ReadMore header="Hvorfor spør vi om dette?" className="mb-2">
    Medarbeideren har rett til å være med og påvirke hvordan arbeidsgiveren kan
    tilrettelegge ved sykefravær. Arbeidsmiljøloven §4-6 sier at både du og
    medarbeideren skal bistå til å finne løsninger, og at dere skal utarbeide
    oppfølgingsplanen sammen. Medarbeideren skal, så langt det er mulig, gi
    relevante opplysninger om arbeidsevnen.
  </ReadMore>
);

export default OPFormFields;
