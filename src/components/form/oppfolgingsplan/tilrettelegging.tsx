import { FormSection } from "@/components/form/formComponents/formSection.tsx";
import { withForm } from "@/components/form/hooks/form.tsx";
import { oppfolgingsplanFormOpts } from "@/components/form/form-options.tsx";
import React from "react";

export const Tilrettelegging = withForm({
  ...oppfolgingsplanFormOpts,
  render: ({ form }) => {
    return (
      <FormSection
        title="Tilrettelegging for å være i arbeid"
        description="Vi ønsker å vite litt om tilretteleggingsmuligheter på arbeidsplassen"
      >
        <form.AppField name="tidligereTilretteleggingBeskrivelse">
          {(field) => (
            <field.BoundTextArea
              label="Tilrettelegging tidligere i sykefraværet"
              description="Beskriv hva dere har forsøkt av tilrettelegging så langt i sykefraværet. Hva har fungert, og hva har ikke fungert?"
              maxLength={500}
            />
          )}
        </form.AppField>
        <form.AppField name="tilretteleggingIDennePerioden">
          {(field) => (
            <field.BoundTextArea
              label="Har dere andre muligheter for tilrettelegging som ikke prøves ut nå? (valgfritt)"
              description="For eksempel involvering av bedriftshelsetjeneste, eller utføre andre typer arbeidsoppgaver"
              maxLength={500}
            />
          )}
        </form.AppField>
        <form.AppField name="sykmeldtesVurdering">
          {(field) => (
            <field.BoundTextArea
              label="Hva tenker den sykmeldte om arbeidsevne og muligheter fremover?"
              description="Er arbeidstaker positiv til å prøve tiltak?  Hvor lenge ser den sykemeldte for seg å være sykmeldt eller delvis sykmeldt?"
              maxLength={500}
            />
          )}
        </form.AppField>
      </FormSection>
    );
  },
});
