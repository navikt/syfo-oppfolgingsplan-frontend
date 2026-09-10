# Åpning av unntaksteksten og påfølgende valg

Arbeidsgivers oversikt måler tre handlinger i unntaksflyten via eksisterende
APM/Faro-instans: `aapnet`, `send` og `lag_plan`. Hendelsesnavnet er
`aid_unntaksvurdering`, domene `aid`, `schema_version=1`,
`tiltakspakke=OPPFOLGINGSPLAN_TILTAKSPAKKE_1`,
`flate=oversikt_arbeidsgiver` og `gruppe=tiltak`.

Komponenten monteres bare når eksisterende vurdering faktisk tilbyr unntak:
tiltaksgruppen med AID-tilpasninger, redigeringstilgang og ingen aktiv plan,
tidligere plan eller utkast. Det gjøres ingen nye vurderingskall for måling.

- `aapnet`: kortet åpnes, én gang per besøk og lederkontekst. Lukking og
  gjenåpning teller ikke flere ganger. Åpning betyr ikke at teksten er lest.
- `send`: skjemaet aktiveres etter åpning, før validering og API-kall. Omfatter
  tastaturinnsending og forsøk uten avkrysset bekreftelse. Gjentatte
  aktiveringer teller hver for seg. Det betyr ikke vellykket registrering.
- `lag_plan`: lenken til utfyllingssiden aktiveres etter åpning i samme besøk,
  også hvis kortet siden er lukket. Det betyr ikke ferdigstilt plan.

Åpningstilstanden holdes lokalt rundt begge valgene. Vanlig rerender, refresh
etter innsending og lukking av kvitteringen bevarer besøket. Ny montering,
annen lederkontekst eller skjuling ved navigasjon i Next sin Activity-grense
nullstiller målingen. Dersom Next gjenoppretter et allerede åpent kort, regnes
det ikke som en ny eksplisitt åpning: handlinger teller først etter at brukeren
har lukket og åpnet kortet i det nye besøket. En annen nettleserfane eller
et senere besøk kobles ikke til den første åpningen.

Kontrakten tillater bare de tre hendelsene. Ekstra felter fjernes. Ingen navn,
person-, leder-, virksomhets-, plan- eller besøks-ID, unntaksgrunn eller fritekst
legges til. Eksisterende APM-metadata og normalisering beholdes. APM-feil eller
manglende APM-instans påvirker ikke brukerhandlingen. Lokal/demo har ingen
initialisert APM-instans og sender ikke disse hendelsene.

AID-dashboardet viser tre tall i «Unntaksvurdering · tiltaksgruppen». Det teller
registrerte åpninger og handlinger, ikke unike personer. Send og lag plan kan
forekomme i samme besøk, og gjenforsøk kan gi flere handlinger enn åpninger.
Tallene er derfor ikke en konverteringstrakt. Ingen nye resultat-/feilmålinger
eller visninger av kortet legges til. Historikk finnes først etter utrulling;
manglende måledata er ikke dokumentert null bruk.

Kontroller i dev at åpning, tastaturinnsending, ugyldig innsending og planklikk
gir de avtalte hendelsene, og at de faktiske feltnavnene kan leses i Loki.
Dokumenter første produksjonsutrulling og observerte kategorier når de finnes.
