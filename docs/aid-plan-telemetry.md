# Levering og opprettelse av oppfølgingsplan

Dette er produkttelemetri for arbeidsgivers «Lag oppfølgingsplan»-skjema, ikke effektanalyse eller telling av unike personer. Hendelsene bruker den eksisterende NAIS APM/Faro-instansen og dens metadata og scrubbing. Ingen ekstra Flaggskipet-oppslag eller nye avhengigheter.

## Kontrakt

Hendelsesnavn: `aid_oppfolgingsplan`. Domene: `aid`. Faste felter: `schema_version=1`, `tiltakspakke=OPPFOLGINGSPLAN_TILTAKSPAKKE_1`, `flate=ny_plan`.

| Felt | Tillatte verdier og betydning |
| --- | --- |
| `gruppe` | `tiltak`, `kontroll`, `utenfor_scope`, `ukjent`. Tildelingen fra eksisterende vurdering for virksomheten, før funksjonsbryteren. Manglende vurdering og feil er ukjent, aldri kontroll. |
| `variant` | `aid` eller `standard`. Skjemavarianten som faktisk leveres, etter funksjonsbryteren. Tiltak kan få standard når bryteren er av. |
| `hendelse` | `beslutning`, `vist` eller `opprett`. |
| `utfall` | `tilgjengelig` for beslutning/visning. `forsok`, `bekreftet` eller `feilet` for opprettelse. |

- `beslutning` sendes når skjema og vurdering er lastet. Det telles én gang per montering/lederkontekst, ikke per rerender.
- `vist` krever at skjemabeholderen kommer inn i skjermbildet. Det betyr ikke at hele skjemaet, et bestemt AID-felt eller innholdet er lest. Ingen visning konstrueres dersom IntersectionObserver mangler. Stegbytte teller ikke et nytt besøk.
- `opprett/forsok` sendes når et validert skjema faktisk sendes til serverhandlingen. Klikk på oppsummering, ugyldig skjema og lagring av utkast er ikke opprettelsesforsøk.
- `opprett/bekreftet` krever at serverhandlingen returnerer et vellykket resultat fra opprettelses-API-et. Målingen skjer før navigasjon til aktiv plan, ikke ved å tolke URL-en eller kvitteringsteksten.
- `opprett/feilet` betyr at klienten fikk en feil eller ikke kunne få bekreftet serverhandlingen. Det beviser ikke at backend aldri lagret planen: forbindelsen kan feile etter lagring.

En synkron sperre hindrer at gjentatte klikk køer flere opprettelser fra samme skjema. Feil åpner for et nytt forsøk; etter bekreftelse beholdes sperren frem til navigasjon. Dette er ikke backend-idempotens på tvers av faner, omlasting eller nettverksfeil.

## Avgrensning

- Ett orgnummer per skjema; ingen «blandet»-kategori.
- Gruppene sendes som lukkede kategorier. Ingen leder-, virksomhets-, person- eller plan-ID, skjemaopplysninger, datoer eller fritekst legges til hendelsesfeltene. Ukjente felter fjernes og ugyldige kategorier forkastes.
- Lokal/demo bruker mockdata og sender ikke APM-hendelser.
- Miljø følger eksisterende NAIS APM-metadata. Grafana-spørringer må avgrense både tjenesten og `app_environment` til valgt dev/prod-miljø.
- Opprettelse kan også være en ny versjon av en eksisterende plan. Det er ikke nødvendigvis personens første plan eller oppstart av utfylling.
- Evalueringspåminnelsens ja/nei-valg måles ikke her. Det er noe annet enn bestilt/ikke bestilt påminnelse om å lage plan i Dine sykmeldte.
- Browserhendelser kan mangle på grunn av blokkering, nettverksfeil eller avbrutt navigasjon. De er ikke en fullstendig backendteller, og manglende data betyr ikke null bruk.
- Hendelsene kan ikke kobles til personer eller forløp og skal ikke brukes til en personbasert konverteringsprosent mellom apper.

## Komposisjon

`hentTildelingsgrupper` beholder kategoriene fra det eksisterende oppslaget. `hentTiltakspakkeContext` er delt med React cache per server-render; den eksisterende boolske hjelpefunksjonen bruker samme resultat. Siden sender bare gruppe og UI-flagg til skjemaet.

`usePlanDeliveryTelemetry` eier beslutning og viewport-visning. Opprettelseshooken eier innsending, resultat og navigasjon. Serverhandlingen beholder validering, TokenX og API-kall, returnerer resultatet og invaliderer berørte sider ved suksess. Klienten går deretter til samme aktive plan-side som før.

## Kontroll før tallene tas i bruk

1. Human review og dev-utrulling.
2. Bekreft tildeling og variant ved tiltak, kontroll, utenfor scope, ukjent og avslått funksjonsbryter. Ingen ekstra vurderingskall.
3. Bekreft én beslutning, faktisk visning og ett forsøk/resultat ved ferdigstilling. Feil må ikke gi bekreftet opprettelse; dobbeltklikk må ikke gi flere kall.
4. Verifiser faktiske feltnavn i Grafana før dashboardpaneler aktiveres. Hold denne hendelsen atskilt fra `aid_paaminnelse` og eksisterende usegmenterte backendtellere. Ikke fyll prod med syntetiske produktoperasjoner.

Plattformreferanser: [NAIS frontend-observability](https://doc.nais.io/observability/frontend/) og [Next.js cache-invalidering etter mutasjoner](https://nextjs.org/docs/app/api-reference/functions/revalidatePath).
