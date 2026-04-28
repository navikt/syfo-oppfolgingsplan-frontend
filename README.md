# Oppfølgingsplan – frontend

[![Build & Deploy](https://github.com/navikt/syfo-oppfolgingsplan-frontend/actions/workflows/build-and-deploy.yaml/badge.svg)](https://github.com/navikt/syfo-oppfolgingsplan-frontend/actions/workflows/build-and-deploy.yaml)
![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![Biome](https://img.shields.io/badge/Biome-2-60a5fa?logo=biome&logoColor=white)
![Vitest](https://img.shields.io/badge/Vitest-4-6E9F18?logo=vitest&logoColor=white)

## Formål

Frontend for oppfølgingsplan mellom sykmeldt arbeidstaker og arbeidsgiver. Appen lar begge parter opprette, redigere og dele en felles oppfølgingsplan som brukes i sykefraværsoppfølgingen.

- **Sykmeldt** ser sine planer under [Ditt sykefravær](https://www.nav.no/syk/sykefravaer)
- **Arbeidsgiver** ser planene via [Dine sykmeldte](https://www.nav.no/arbeidsgiver/sykmeldte)

Appen lever under `basePath` `/syk/oppfolgingsplan`[^basepath].

## Teknologier

| Kategori | Teknologi |
|---|---|
| Rammeverk | Next.js 16 (App Router, standalone output) |
| UI | [Aksel](https://aksel.nav.no/) (`@navikt/ds-react`), Tailwind CSS 4 |
| Skjema | `@tanstack/react-form`, Zod 4 |
| Auth | ID-porten (sidecar med autoLogin), TokenX for backend-kall |
| Observability | Grafana Faro (frontend), OpenTelemetry auto-instrumentation, Prometheus, Loki |
| Test | Vitest, Testing Library |
| Lint/format | Biome |

## Miljøer

| Miljø | URL |
|---|---|
| Dev | https://www.ekstern.dev.nav.no/syk/oppfolgingsplan |
| Prod | https://www.nav.no/syk/oppfolgingsplan |
| Demo | Dynamisk ingress per branch |

## Backend-avhengigheter

### [syfo-oppfolgingsplan-backend](https://github.com/navikt/syfo-oppfolgingsplan-backend)

Oppfølgingsplanens hoveddatakilde. Håndterer planer, utkast, ferdigstilling og deling.

### [lumi-api](https://github.com/navikt/lumi-api)

Brukerundersøkelser og tilbakemeldinger.

### [nav-dekoratoren](https://github.com/navikt/nav-dekoratoren)

Navs felles header og footer.

## Utvikling (kjøre lokalt)

For å komme i gang med å bygge og kjøre appen, se vår [Wiki for frontendapper](https://navikt.github.io/team-esyfo/utvikling/frontend/).

## For Nav-ansatte

Interne henvendelser kan sendes via Slack i kanalen [#esyfo](https://nav-it.slack.com/archives/C012X796B4L).

---

[^basepath]: `basePath`-verdien settes i Next.js-konfigurasjonen i `next.config.ts` og angir URL-prefikset som hele appen lever under.
