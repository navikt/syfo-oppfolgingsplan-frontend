import { FormSection } from "@/components/form/formSection";
import { Textarea } from "@navikt/ds-react";

export const Arbeidssituasjon = () => {
  return (
    <FormSection
      title="Arbeidssituasjon"
      description="I dette steget ønsker vi at dere skal beskrive hvordan en vanlig arbeidsdag utspiller seg, hvilke oppgaver som kan og ikke kan utføres."
    >
      <Textarea
        label="Hvordan ser en vanlig arbeidsdag ut?"
        description="Beskriv en vanlig arbeidsdag og hvilke oppgaver arbeidstaker gjør på jobben:"
      />
      <Textarea
        label="Hvilke ordinære arbeidsoppgaver kan forstatt utføres? "
        description="Beskriv hvilke oppgaver kan arbeidstaker fortsatt gjøre med eller uten tilpasninger:"
      />
      <Textarea
        label="Hvilke ordinære arbeidsoppgaver kan ikke utføres?"
        description="Er det noen oppgaver som er helt umulige å utføre?"
      />
    </FormSection>
  );
};
