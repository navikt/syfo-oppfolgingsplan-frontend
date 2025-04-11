import { FormSection } from "@/components/form/formSection";
import { Textarea } from "@navikt/ds-react";

export const Tilrettelegging = () => {
  return (
    <FormSection
      title="Tilrettelegging for å være i arbeid"
      description="Vi ønsker å vite litt om tilretteleggingsmuligheter på arbeidsplassen"
    >
      <Textarea
        label="Tilrettelegging tidligere i sykefraværet"
        description="Beskriv hva dere har forsøkt av tilrettelegging så langt i sykefraværet. Hva har fungert, og hva har ikke fungert?"
      />
      <Textarea
        label="Har dere andre muligheter for tilrettelegging som ikke prøves ut nå? (valgfritt)"
        description="For eksempel involvering av bedriftshelsetjeneste, eller utføre andre typer arbeidsoppgaver"
      />
      <Textarea
        label="Hva tenker den sykmeldte om arbeidsevne og muligheter fremover?"
        description="Er arbeidstaker positiv til å prøve tiltak?  Hvor lenge ser den sykemeldte for seg å være sykmeldt eller delvis sykmeldt?"
      />
    </FormSection>
  );
};
