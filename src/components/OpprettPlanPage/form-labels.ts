import { OppfolgingsplanForm } from "@/schema/oppfolgingsplanFormSchemas";

export const formLabels: Record<
  keyof OppfolgingsplanForm,
  { label: string; description?: string }
> = {
  typiskArbeidshverdag: {
    label: "Hvordan ser en vanlig arbeidsdag ut?",
    description: "Beskriv hvilke arbeidsoppgaver den ansatte gjør på jobben.",
  },
  arbeidsoppgaverSomKanUtfores: {
    label: "Hvilke arbeidsoppgaver kan fortsatt utføres?",
    description:
      "Beskriv hvilke oppgaver den ansatte fortsatt kan gjøre med eller uten tilrettelegging.",
  },
  arbeidsoppgaverSomIkkeKanUtfores: {
    label: "Hvilke arbeidsoppgaver kan ikke utføres?",
  },
  tidligereTilrettelegging: {
    label: "Tilrettelegging tidligere i sykefraværet",
    description:
      "Beskriv hva dere har forsøkt av tilrettelegging så langt i sykefraværet. Hva har fungert,  hva har ikke fungert og hva må kanskje justeres.",
  },
  tilretteleggingFremover: {
    label: "Hvordan skal dere tilrettelegge arbeidshverdagen fremover?",
    description:
      "Beskriv hva dere skal gjøre for at den ansatte kan være i noe jobb.",
  },
  annenTilrettelegging: {
    label:
      "Har dere andre muligheter for tilrettelegging som ikke prøves ut nå?",
    description:
      "For eksempel involvering av bedriftshelsetjeneste, eller utføre andre typer arbeidsoppgaver.",
  },
  hvordanFolgeOpp: {
    label: "Hvordan skal dere følge opp avtalt tilrettelegging?",
  },
  harDenAnsatteMedvirket: {
    label: "Har den ansatte vært med å lage planen?",
    description:
      "Den ansatte har rett til å være med og påvirke hvordan arbeidsgiver kan tilrettelegge jobben ved sykefravær. Arbeidsmiljøloven sier at både du og den ansatte skal bidra til å finne løsninger, og at oppfølgingsplanen skal utarbeides i samarbeid. Den ansatte skal gi relevante opplysninger om arbeidsevne, så langt det er mulig.",
  },
  denAnsatteHarIkkeMedvirketBegrunnelse: {
    label: "Hvorfor har ikke den ansatte deltatt?",
    description:
      "Du kan for eksempel opplyse om at den ansatte er for syk, eller at den ansatte er utilgjengelig.",
  },
  evalueringDato: {
    label: "Når skal dere evaluere planen og eventuelt justere den?",
    description:
      "Den ansatte har rett til å være med og påvirke hvordan arbeidsgiver kan tilrettelegge jobben ved sykefravær. Arbeidsmiljøloven sier at både du og den ansatte skal bidra til å finne løsninger, og at oppfølgingsplanen skal utarbeides i samarbeid. Arbeidstakeren skal gi relevante opplysninger om arbeidsevne, så langt det er mulig.",
  },
} as const;

export const formHeadings = {
  arbeidsoppgaver: "Arbeidsoppgaver",
  tilrettelegging: "Tilrettelegging",
} as const;
