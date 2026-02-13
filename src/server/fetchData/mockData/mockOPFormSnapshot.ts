import { FormSnapshot } from "@/utils/FormSnapshot/schemas/FormSnapshot";

export const mockPlanFormSnapshot: FormSnapshot = {
  formIdentifier: "oppfolgingsplan-navno",
  formSemanticVersion: "1.0.0",
  formSnapshotVersion: "2.0.0",
  sections: [
    {
      sectionId: "arbeidsoppgaver",
      sectionTitle: "Arbeidsoppgaver",
      fields: [
        {
          fieldId: "typiskArbeidshverdag",
          fieldType: "TEXT",
          label: "Hvordan ser en vanlig arbeidsdag ut?",
          description:
            "Beskriv hvilke arbeidsoppgaver den ansatte gjør på jobben.",
          value:
            "Arbeidsdagen starter vanligvis kl. 07:30 med å ta imot barn og korte overleveringer fra foreldre. Deretter følger frokost og fri lek hvor jeg veileder barna i samspill og språk. Midt på dagen har vi samlingsstund, temaarbeid og utelek før lunsj. Etter hvile- eller rolig stund dokumenterer jeg observasjoner og forbereder neste dags aktiviteter. Dagen avsluttes med tilstedeværelse i garderoben og dialog med foreldre om barnas dag.",
          wasRequired: true,
        },
        {
          fieldId: "arbeidsoppgaverSomKanUtfores",
          fieldType: "TEXT",
          label: "Hvilke arbeidsoppgaver kan fortsatt utføres?",
          description: null,
          value:
            "Kan gjennomføre samlingsstund med høytlesing, sanger og enkle språkstimulerende aktiviteter. Kan planlegge pedagogiske opplegg og lage månedsplaner digitalt. Kan følge opp enkeltbarn i rolige aktiviteter inne, dokumentere observasjoner og samarbeide med pedagogisk leder om tilpasninger. Kan være ute i korte økter og veilede lek uten mye fysisk aktivitet.",
          wasRequired: true,
        },
        {
          fieldId: "arbeidsoppgaverSomIkkeKanUtfores",
          fieldType: "TEXT",
          label: "Hvilke arbeidsoppgaver kan ikke utføres?",
          description: null,
          value:
            "Kan ikke løfte tunge barn opp på stellebenk eller bære flere barn samtidig. Unngår å dra store lekekasser, flytte møbler eller håndtere tyngre uteleker. Deltar ikke i lange turer i ulendt terreng eller snømåking på vinterstid. Skal ikke stå lenge bøyd ved lavt bord eller sitte på gulvet over lengre perioder på grunn av belastning på kne og rygg.",
          wasRequired: true,
        },
      ],
    },
    {
      sectionId: "tilrettelegging",
      sectionTitle: "Tilrettelegging",
      fields: [
        {
          fieldId: "tidligereTilrettelegging",
          fieldType: "TEXT",
          label: "Tilrettelegging tidligere i sykefraværet",
          description:
            "Beskriv hva dere har forsøkt av tilrettelegging så langt i sykefraværet. Hva har fungert,  hva har ikke fungert og hva må kanskje justeres.",
          value:
            "Har tidligere fått avlastning i morgenøktene når det er mest løfting ved påkledning. Fikk høy regulerbar stol til samlingsstund slik at jeg kunne delta uten å sitte direkte på gulvet. Har hatt strukturert plan for mikropauser hver time for å avlaste kneet. I en tidligere periode med lignende utfordringer fungerte dette godt og ga mindre smerte utover dagen.",
          wasRequired: true,
        },
        {
          fieldId: "tilretteleggingFremover",
          fieldType: "TEXT",
          label: "Hvordan skal dere tilrettelegge arbeidshverdagen fremover?",
          description: null,
          value:
            "Behov for å unngå tunge og hyppige løft i garderobe og stell, spesielt i hent- og bringesituasjonen. Ønsker primært ansvar for planlegging, dokumentasjon og rolige stasjonsaktiviteter inne. Kortere økter ute (15–20 min) før avlastning. Tilgang til ergonomisk krakk i samlingsstund og ved påkledning. Mulighet for å variere mellom stående og sittende arbeid gjennom dagen.",
          wasRequired: true,
        },
        {
          fieldId: "annenTilrettelegging",
          fieldType: "TEXT",
          label:
            "Har dere andre muligheter for tilrettelegging som ikke prøves ut nå?",
          description:
            "For eksempel involvering av bedriftshelsetjeneste, eller utføre andre typer arbeidsoppgaver.",
          value:
            "Mulighet for fysioterapiøvelser i et stille rom 2 x 10 minutter i løpet av dagen. Kan bruke støttende knebandasje ved behov. Åpen for å teste roterende oppgaveplan slik at tunge økter fordeles bedre i teamet. Dersom situasjonen bedres kan gradvis økning i fysisk deltakelse prøves etter avtale.",
          wasRequired: true,
        },
        {
          fieldId: "hvordanFolgeOpp",
          fieldType: "TEXT",
          label: "Hvordan skal dere følge opp avtalt tilrettelegging?",
          description: null,
          value:
            "Kort daglig sjekk (2–3 minutter) første to uker for å fange opp justeringsbehov. Deretter ukentlig strukturert gjennomgang av hvordan fordelingen av oppgaver fungerer. Evaluering av smertebelastning og funksjon ved hjelp av enkel egenrapportering. Justering av planen ved endringer i medisinske anbefalinger eller når progresjon tilsier det. Kontakt med bedriftshelsetjenesten ved behov.",
          wasRequired: true,
        },
        {
          fieldId: "evalueringsDato",
          fieldType: "DATE",
          label: "Når skal dere evaluere planen og eventuelt justere den?",
          description: null,
          value: "2026-03-16",
          wasRequired: true,
        },
        {
          fieldId: "harDenAnsatteMedvirket",
          fieldType: "RADIO_GROUP",
          label:
            "Har du snakket med den ansatte om innholdet i planen, enten på telefon eller i møte?",
          description: null,
          selectedOptionId: "ja",
          options: [
            { optionId: "ja", optionLabel: "Ja" },
            { optionId: "nei", optionLabel: "Nei" },
          ],
          wasRequired: true,
        },
      ],
    },
  ],
};
