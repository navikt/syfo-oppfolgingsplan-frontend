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
        <form.AppField name="tidligereTilrettelegging">
          {(field) => (
            <field.BoundTextArea
              label="Tilrettelegging tidligere i sykefraværet"
              description="Beskriv hva dere har forsøkt av tilrettelegging så langt i sykefraværet. Hva har fungert, og hva har ikke fungert?"
              maxLength={500}
            />
          )}
        </form.AppField>
        <form.AppField name="tilretteleggingFremover">
          {(field) => (
            <field.BoundTextArea
              label="Har dere andre muligheter for tilrettelegging som ikke prøves ut nå? (valgfritt)"
              description="For eksempel involvering av bedriftshelsetjeneste, eller utføre andre typer arbeidsoppgaver"
              maxLength={500}
            />
          )}
        </form.AppField>
      </FormSection>
    );
  },
});
