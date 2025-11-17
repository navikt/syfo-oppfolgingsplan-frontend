import { OppfolgingsplanForm } from "@/schema/oppfolgingsplanFormSchemas";

export const mockOpprettetPlanContent: OppfolgingsplanForm = {
  typiskArbeidshverdag:
    "Arbeidsdagen starter vanligvis kl. 07:30 med å ta imot barn og korte overleveringer fra foreldre. Deretter følger frokost og fri lek hvor jeg veileder barna i samspill og språk. Midt på dagen har vi samlingsstund, temaarbeid og utelek før lunsj. Etter hvile- eller rolig stund dokumenterer jeg observasjoner og forbereder neste dags aktiviteter. Dagen avsluttes med tilstedeværelse i garderoben og dialog med foreldre om barnas dag.",
  arbeidsoppgaverSomKanUtfores:
    "Kan gjennomføre samlingsstund med høytlesing, sanger og enkle språkstimulerende aktiviteter. Kan planlegge pedagogiske opplegg og lage månedsplaner digitalt. Kan følge opp enkeltbarn i rolige aktiviteter inne, dokumentere observasjoner og samarbeide med pedagogisk leder om tilpasninger. Kan være ute i korte økter og veilede lek uten mye fysisk aktivitet.",
  arbeidsoppgaverSomIkkeKanUtfores:
    "Kan ikke løfte tunge barn opp på stellebenk eller bære flere barn samtidig. Unngår å dra store lekekasser, flytte møbler eller håndtere tyngre uteleker. Deltar ikke i lange turer i ulendt terreng eller snømåking på vinterstid. Skal ikke stå lenge bøyd ved lavt bord eller sitte på gulvet over lengre perioder på grunn av belastning på kne og rygg.",
  tidligereTilrettelegging:
    "Har tidligere fått avlastning i morgenøktene når det er mest løfting ved påkledning. Fikk høy regulerbar stol til samlingsstund slik at jeg kunne delta uten å sitte direkte på gulvet. Har hatt strukturert plan for mikropauser hver time for å avlaste kneet. I en tidligere periode med lignende utfordringer fungerte dette godt og ga mindre smerte utover dagen.",
  tilretteleggingFremover:
    "Behov for å unngå tunge og hyppige løft i garderobe og stell, spesielt i hent- og bringesituasjonen. Ønsker primært ansvar for planlegging, dokumentasjon og rolige stasjonsaktiviteter inne. Kortere økter ute (15–20 min) før avlastning. Tilgang til ergonomisk krakk i samlingsstund og ved påkledning. Mulighet for å variere mellom stående og sittende arbeid gjennom dagen.",
  annenTilrettelegging:
    "Mulighet for fysioterapiøvelser i et stille rom 2 x 10 minutter i løpet av dagen. Kan bruke støttende knebandasje ved behov. Åpen for å teste roterende oppgaveplan slik at tunge økter fordeles bedre i teamet. Dersom situasjonen bedres kan gradvis økning i fysisk deltakelse prøves etter avtale.",
  hvordanFolgeOpp:
    "Kort daglig sjekk (2–3 minutter) første to uker for å fange opp justeringsbehov. Deretter ukentlig strukturert gjennomgang av hvordan fordelingen av oppgaver fungerer. Evaluering av smertebelastning og funksjon ved hjelp av enkel egenrapportering. Justering av planen ved endringer i medisinske anbefalinger eller når progresjon tilsier det. Kontakt med bedriftshelsetjenesten ved behov.",
  evalueringDato: new Date(new Date().setMonth(new Date().getMonth() + 1)),
  harDenAnsatteMedvirket: "ja",
  denAnsatteHarIkkeMedvirketBegrunnelse: "",
};
