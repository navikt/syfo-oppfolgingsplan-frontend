# Levering og opprettelse av oppfølgingsplan

Dette er produkttelemetri for arbeidsgivers «Lag oppfølgingsplan»-skjema, ikke effektanalyse eller telling av unike personer. Hendelsene bruker den eksisterende NAIS APM/Faro-instansen og dens metadata og scrubbing, uten nye avhengigheter. Tildelingsgruppen gjenbruker det eksisterende Flaggskipet-oppslaget per server-render. Vellykket lagring medfører en ekstra oppfriskning av gjeldende side, beskrevet under komposisjon.

## Kontrakt

Hendelsesnavn: `aid_oppfolgingsplan`. Domene: `aid`. Faste felter: `schema_version=1`, `tiltakspakke=OPPFOLGINGSPLAN_TILTAKSPAKKE_1`, `flate=ny_plan`.

| Felt | Tillatte verdier og betydning |
| --- | --- |
| `gruppe` | `tiltak`, `kontroll`, `utenfor_scope`, `ukjent`. Tildelingen fra eksisterende vurdering for virksomheten, før funksjonsbryteren. Manglende vurdering og feil er ukjent, aldri kontroll. |
| `skjemavariant` | `tiltak` eller `standard`. Skjemavarianten som faktisk leveres, etter funksjonsbryteren. Tiltak kan få standard når bryteren er av. |
| `hendelse` | `beslutning`, `vist` eller `opprett`. |
| `utfall` | `tilgjengelig` for beslutning/visning. `forsok`, `bekreftet` eller `feilet` for opprettelse. |
| `evaluering_paaminnelse` | `ja` eller `nei`, bare ved `opprett`. Verdien av `evalueringPaaminnelse` i innsendingen, tatt vare på før serverkallet og brukt på både forsøk og resultat. |

- `beslutning` sendes når skjema og vurdering er lastet. Det telles én gang per montering/lederkontekst, ikke per rerender.
- `vist` krever at skjemabeholderen kommer inn i skjermbildet. Det betyr ikke at hele skjemaet, et bestemt AID-felt eller innholdet er lest. Ingen visning konstrueres dersom IntersectionObserver mangler. Stegbytte teller ikke et nytt besøk.
- `opprett/forsok` sendes når et validert skjema faktisk sendes til serverhandlingen. Klikk på oppsummering, ugyldig skjema og lagring av utkast er ikke opprettelsesforsøk.
- `opprett/bekreftet` krever at serverhandlingen returnerer et vellykket resultat fra opprettelses-API-et. Målingen skjer før navigasjon til aktiv plan, ikke ved å tolke URL-en eller kvitteringsteksten.
- `opprett/feilet` betyr at klienten fikk en feil eller ikke kunne få bekreftet serverhandlingen. Det beviser ikke at backend aldri lagret planen: forbindelsen kan feile etter lagring.

En synkron sperre hindrer at gjentatte klikk køer flere opprettelser fra samme aktive skjema. Feil åpner for et nytt forsøk; etter bekreftelse beholdes sperren frem til navigasjon. Dersom brukeren forlater skjemaet, registreres et eventuelt sent resultat fortsatt med opprinnelig tildeling, men det får ikke navigere brukeren tilbake. Dette gjelder også når Next skjuler og senere gjenbruker skjemaet. Dette er ikke backend-idempotens på tvers av faner, omlasting eller nettverksfeil.

## Avgrensning

- Ett orgnummer per skjema; ingen «blandet»-kategori.
- Gruppene og evalueringspåminnelsen sendes som lukkede kategorier. Ingen leder-, virksomhets-, person- eller plan-ID, øvrige skjemaopplysninger, datoer eller fritekst legges til hendelsesfeltene. Ukjente felter fjernes og ugyldige kategorier forkastes.
- Lokal/demo bruker mockdata og sender ikke APM-hendelser.
- Miljø følger eksisterende NAIS APM-metadata. Grafana-spørringer må avgrense både tjenesten og `app_environment` til valgt dev/prod-miljø.
- Opprettelse kan også være en ny versjon av en eksisterende plan. Det er ikke nødvendigvis personens første plan eller oppstart av utfylling.
- Evalueringspåminnelsen gjelder evaluering av planen, ikke påminnelse om å lage plan i Dine sykmeldte. `ja` betyr at innsendingen ber om evalueringspåminnelse, ikke at en påminnelse er sendt eller at planen er evaluert. `bekreftet` gjelder fortsatt opprettelses-API-et, ikke en separat bekreftelse fra varslingstjenesten.
- Bare `skjemavariant=tiltak` tilbyr ja/nei-valget i skjemaet. Bruk denne varianten når ønsket påminnelse skal analyseres; `nei` i standardvarianten er ikke et aktivt avslag. Innsendt verdi beholdes også i standardvarianten, slik at eventuelle gjenbrukte utkast ikke feilaktig måles som et annet API-ønske.
- Feltet er en additiv utvidelse av versjon 1. Eldre opprettelseshendelser mangler det, og manglende felt skal ikke telles som `nei`. Eksisterende telling av opprettelser på tvers av påminnelsesvalg er uendret. Beslutning og visning har ikke et innsendt valg og får derfor ikke feltet.
- Browserhendelser kan mangle på grunn av blokkering, nettverksfeil eller avbrutt navigasjon. De er ikke en fullstendig backendteller, og manglende data betyr ikke null bruk.
- Hendelsene kan ikke kobles til personer eller forløp og skal ikke brukes til en personbasert konverteringsprosent mellom apper.

## Komposisjon

`hentTildelingsgrupper` beholder kategoriene fra det eksisterende oppslaget. `hentTiltakspakkeContext` er delt med React cache per server-render; den eksisterende boolske hjelpefunksjonen bruker samme resultat. Siden sender bare gruppe og UI-flagg til skjemaet.

`usePlanDeliveryTelemetry` eier beslutning og viewport-visning. Opprettelseshooken eier innsending, resultat og navigasjon. Serverhandlingen beholder validering, TokenX og API-kall, returnerer resultatet og invaliderer berørte sider ved suksess. Klienten går deretter til samme aktive plan-side som før.

Resultatet måles når serverhandlingen svarer, mens navigasjonen skjer i en effect etter at React har tatt i bruk resultatet fra `useActionState`. Dette skillet lar en nyere navigasjon fullføre selv om målsiden laster tregt og det gamle skjemaet fortsatt er montert. Effecten kontrollerer også at resultatet tilhører den aktive innsendingen; et gammelt resultat får ikke navigere etter at skjemaet er forlatt eller gjenbrukt.

`revalidatePath` oppfrisker også den gjeldende serversiden som del av svaret fra serverhandlingen. Derfor kan vellykket ferdigstilling starte utkast-, oversikts- og Flaggskipet-oppslag for utfyllingssiden før navigasjonen henter aktiv plan. React-cache deler bare resultater innenfor én server-render, ikke mellom disse to. Dette er en bevisst kostnad ved å få et eksplisitt API-resultat til målingen og samtidig unngå gjenbruk av en gammel aktiv plan eller oversikt. Det er ikke et ekstra opprettelseskall, og beslutning/visning telles ikke på nytt ved en vanlig rerender av samme skjema.

Vi beholder Next sine offentlige API-er for invalidering og klientnavigasjon. Målingen tolker ikke rammeverkets interne redirect-feil, og innfører ikke full sidelasting eller cache-busting-parametere. Lokal/demo hopper over revalideringen og kan derfor ikke alene verifisere denne serverflyten.

## Kontroll før tallene tas i bruk

1. Human review og dev-utrulling.
2. Bekreft tildeling og variant ved tiltak, kontroll, utenfor scope, ukjent og avslått funksjonsbryter. Tildeling og UI skal dele vurderingskallet innenfor samme server-render.
3. Bekreft én beslutning, faktisk visning og ett forsøk/resultat ved ferdigstilling. Feil må ikke gi bekreftet opprettelse; dobbeltklikk må ikke gi flere opprettelseskall. Naviger bort under lagring og kontroller at et sent svar ikke sender brukeren tilbake. Kontroller ferske data i en tidligere besøkt aktiv plan/oversikt og antall oppslag ved revalideringen.
4. Verifiser faktiske feltnavn i Grafana før dashboardpaneler aktiveres. Hold denne hendelsen atskilt fra `aid_paaminnelse` og eksisterende usegmenterte backendtellere. Ikke fyll prod med syntetiske produktoperasjoner.

Plattformreferanser: [NAIS frontend-observability](https://doc.nais.io/observability/frontend/) og [Next.js cache-invalidering etter mutasjoner](https://nextjs.org/docs/app/api-reference/functions/revalidatePath).
