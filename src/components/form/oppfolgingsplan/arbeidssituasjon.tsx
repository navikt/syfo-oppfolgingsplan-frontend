import { FormSection } from "@/components/form/formComponents/formSection.tsx";
import React from "react";
import { withForm } from "@/components/form/hooks/form.tsx";
import { oppfolgingsplanFormOpts } from "@/components/form/form-options.tsx";

export const Arbeidssituasjon = withForm({
  ...oppfolgingsplanFormOpts,
  render: ({ form }) => {
    return (
      <FormSection
        title="Arbeidssituasjon"
        description="I dette steget ønsker vi at dere skal beskrive hvordan en vanlig arbeidsdag utspiller seg, hvilke oppgaver som kan og ikke kan utføres."
      >
        <form.AppField name="typiskArbeidshverdag">
          {(field) => (
            <field.BoundTextArea
              label="Hvordan ser en vanlig arbeidsdag ut?"
              description="Beskriv en vanlig arbeidsdag og hvilke oppgaver arbeidstaker gjør på jobben:"
              maxLength={500}
            />
          )}
        </form.AppField>

        <form.AppField name="arbeidsoppgaverSomKanUtfores">
          {(field) => (
            <field.BoundTextArea
              label="Hvilke ordinære arbeidsoppgaver kan forstatt utføres? "
              description="Beskriv hvilke oppgaver kan arbeidstaker fortsatt gjøre med eller uten tilpasninger:"
              maxLength={500}
            />
          )}
        </form.AppField>

        <form.AppField name="arbeidsoppgaverSomIkkeKanUtfores">
          {(field) => (
            <field.BoundTextArea
              label="Hvilke ordinære arbeidsoppgaver kan ikke utføres?"
              description="Er det noen oppgaver som er helt umulige å utføre?"
              maxLength={500}
            />
          )}
        </form.AppField>
      </FormSection>
    );
  },
});
