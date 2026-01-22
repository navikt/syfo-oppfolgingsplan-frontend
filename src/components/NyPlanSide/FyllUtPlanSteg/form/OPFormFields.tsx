import {
  Alert,
  BodyLong,
  BodyShort,
  Box,
  Heading,
  Link,
  ReadMore,
} from "@navikt/ds-react";
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
      <BodyLong spacing>Alle felt må fylles ut.</BodyLong>

      {isReadOnly && (
        <Alert variant="info" size="small" className="mb-12">
          <Heading level="3" size="small" spacing>
            Den ansatte er ikke sykmeldt
          </Heading>
          <Box>
            <BodyShort>
              Du kan ikke redigere planen nå. Skjemaet er kun åpent når den
              ansatte har en sykmelding, eller det er mindre enn 16 dager siden
              siste sykmeldingsdato.
            </BodyShort>
          </Box>
        </Alert>
      )}

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
            isRequired
            isChangeDisabled={isChangeDisabled}
            isReadOnly={isReadOnly}
          />
        )}
      </form.AppField>

      <form.AppField name="arbeidsoppgaverSomKanUtfores">
        {(field) => (
          <field.FormTextArea
            label={formLabels.arbeidsoppgaverSomKanUtfores.label}
            isRequired
            isChangeDisabled={isChangeDisabled}
            isReadOnly={isReadOnly}
          />
        )}
      </form.AppField>

      <form.AppField name="arbeidsoppgaverSomIkkeKanUtfores">
        {(field) => (
          <field.FormTextArea
            label={formLabels.arbeidsoppgaverSomIkkeKanUtfores.label}
            isRequired
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
          Arbeidsgivere plikter å legge til rette for alle arbeidstakere. Her
          kan du lese mer om{" "}
          <Link
            href="https://www.nav.no/arbeidsgiver/tilretteleggingsplikt"
            target="_blank"
          >
            den generelle tilretteleggingsplikten
          </Link>
          .
        </BodyLong>
      </TextContentBox>

      <form.AppField name="tidligereTilrettelegging">
        {(field) => (
          <field.FormTextArea
            label={formLabels.tidligereTilrettelegging.label}
            description={formLabels.tidligereTilrettelegging.description}
            isRequired
            isChangeDisabled={isChangeDisabled}
            isReadOnly={isReadOnly}
          />
        )}
      </form.AppField>

      <form.AppField name="tilretteleggingFremover">
        {(field) => (
          <field.FormTextArea
            label={formLabels.tilretteleggingFremover.label}
            description={readMoreOmTilrettelegging}
            isRequired
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
            isRequired
            isChangeDisabled={isChangeDisabled}
            isReadOnly={isReadOnly}
          />
        )}
      </form.AppField>

      <form.AppField name="hvordanFolgeOpp">
        {(field) => (
          <field.FormTextArea
            label={formLabels.hvordanFolgeOpp.label}
            isRequired
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
            isRequired
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
            isRequired
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
                  isRequired
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

const readMoreOmTilrettelegging = (
  <ReadMore header="Hvorfor spør vi om dette?">
    <BodyLong className="mb-2">
      Tilrettelegging handler om alt arbeidsgiver gjør for å tilpasse
      arbeidsoppgaver eller miljøet slik at medarbeideren kan fungere bedre og
      være på jobb. Dette inkluderer tiltak som endringer i arbeidstid,
      arbeidsoppgaver, fysisk miljø eller utstyr. Tiltakene kan være
      midlertidige eller permanente ut fra behovet.
    </BodyLong>
  </ReadMore>
);

const readMoreOmAEvaluerePlanen = (
  <ReadMore header="Hvorfor spør vi om dette?">
    <BodyLong className="mb-2">
      Etter at dere har prøvd ut tilrettelegging i en avtalt tidsperiode bør
      dere følge opp hvordan dette har fungert. Fungerer tilpasningene som
      ønsket? Vi anbefaler at dere går gjennom planen og vurderer å oppdatere
      den innen <strong>fire uker</strong>. Dette gir nok tid til å erfare hva
      som fungerer – og hva som kanskje må endres.
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
