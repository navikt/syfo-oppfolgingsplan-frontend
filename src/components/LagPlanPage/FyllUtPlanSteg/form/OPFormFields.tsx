import Link from "next/link";
import { BodyLong, Heading, ReadMore, VStack } from "@navikt/ds-react";
import TextContentBox from "@/components/layout/TextContentBox";
import { formLabels } from "../form-labels";
import { oppfolgingsplanFormDefaultValues } from "./form-options";
import { withForm } from "./hooks/form";

const OPFormFields = withForm({
  defaultValues: oppfolgingsplanFormDefaultValues,
  render: ({ form }) => (
    <>
      <TextContentBox className="mb-4">
        <Heading level="2" size="medium" spacing>
          Arbeidsoppgaver
        </Heading>
      </TextContentBox>

      <form.AppField name="typiskArbeidshverdag">
        {(field) => (
          <field.FormTextArea
            label={formLabels.typiskArbeidshverdag.label}
            description={formLabels.typiskArbeidshverdag.description}
          />
        )}
      </form.AppField>

      <form.AppField name="arbeidsoppgaverSomKanUtfores">
        {(field) => (
          <field.FormTextArea
            label={formLabels.arbeidsoppgaverSomKanUtfores.label}
          />
        )}
      </form.AppField>

      <form.AppField name="arbeidsoppgaverSomIkkeKanUtfores">
        {(field) => (
          <field.FormTextArea
            label={formLabels.arbeidsoppgaverSomIkkeKanUtfores.label}
          />
        )}
      </form.AppField>

      <TextContentBox className="mb-4">
        <Heading level="2" size="medium" spacing>
          Tilrettelegging
        </Heading>

        <BodyLong size="medium" spacing>
          Arbeidsgivere plikter å legge til rette for alle arbeidstakere. På
          arbeidstilsynet.no kan du lese om{" "}
          <Link
            href="https://www.arbeidstilsynet.no/arbeidstid-og-organisering/tilrettelegging/"
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
          />
        )}
      </form.AppField>

      <form.AppField name="tilretteleggingFremover">
        {(field) => (
          <field.FormTextArea
            label={formLabels.tilretteleggingFremover.label}
          />
        )}
      </form.AppField>

      <form.AppField name="annenTilrettelegging">
        {(field) => (
          <field.FormTextArea
            label={formLabels.annenTilrettelegging.label}
            description={formLabels.annenTilrettelegging.description}
          />
        )}
      </form.AppField>

      <VStack gap="2">
        <form.AppField name="hvordanFolgeOpp">
          {(field) => (
            <field.FormTextArea
              label={formLabels.hvordanFolgeOpp.label}
              minRows={3}
            />
          )}
        </form.AppField>

        <form.AppField name="evalueringDato">
          {(field) => (
            <field.FormDatePicker
              label={formLabels.evalueringDato.label}
              description={
                <ReadMore header="Mer om å evaluere planen" className="mb-0">
                  <BodyLong className="mb-2">
                    Etter at dere har prøvd ut de foreslåtte tilpasningene en
                    stund, er det viktig å ta et steg tilbake og se hvordan det
                    faktisk har gått. Har det blitt lettere å jobbe? Fungerer
                    tilpasningene som ønsket? Eller er det behov for mer støtte
                    eller justeringer?
                  </BodyLong>

                  <BodyLong className="mb-2">
                    For å sikre at planen fortsatt er relevant og nyttig for
                    dere, anbefaler vi at dere evaluerer den innen{" "}
                    <strong>fire uker</strong>. Dette gir nok tid til å erfare
                    hva som fungerer – og hva som kanskje må endres. En god
                    evaluering gir dere bedre støtte og øker sjansen for en
                    tryggere vei tilbake til arbeid.
                  </BodyLong>
                </ReadMore>
              }
              fromDate={tomorrow}
              toDate={oneYearFromNow}
              className="mb-8"
            />
          )}
        </form.AppField>
      </VStack>

      <form.AppField name="harDenAnsatteMedvirket">
        {(field) => (
          <field.FormRadioGroup
            label={formLabels.harDenAnsatteMedvirket.label}
            description={
              <ReadMore header="Hvorfor spør vi om dette?" className="mb-0">
                Medarbeideren har rett til å være med og påvirke hvordan
                arbeidsgiveren kan tilrettelegge ved sykefravær.
                Arbeidsmiljøloven §4-6 sier at både du og medarbeideren skal
                bistå til å finne løsninger, og at dere skal utarbeide
                oppfølgingsplanen sammen. Medarbeideren skal, så langt det er
                mulig, gi relevante opplysninger om arbeidsevnen.
              </ReadMore>
            }
            className="mb-4"
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
                />
              )}
            </form.AppField>
          )
        }
      </form.Subscribe>
    </>
  ),
});

const tomorrow = (() => {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d;
})();

const oneYearFromNow = (() => {
  const d = new Date();
  d.setFullYear(d.getFullYear() + 1);
  return d;
})();

export default OPFormFields;
