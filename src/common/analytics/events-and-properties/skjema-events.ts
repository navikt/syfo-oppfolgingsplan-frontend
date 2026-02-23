import type {
  SkjemaFullfortEvent,
  SkjemaStegFullfortEvent,
} from "@navikt/analytics-types";

export const fyllUtPlanSkjemaStegFullfortEvent: SkjemaStegFullfortEvent = {
  name: "skjema steg fullført",
  properties: {
    komponentId: "gaa-til-oppsummering-knapp",
    skjemanavn: "Oppfølgingsplan",
    steg: "fyll-ut-plan",
  },
};

export const fyllUtPlanSkjemaFullfortEvent: SkjemaFullfortEvent = {
  name: "skjema fullført",
  properties: {
    komponentId: "ferdigstill-oppfolgingsplan-knapp",
    skjemanavn: "Oppfølgingsplan",
    kontekst: "Oppsummering",
  },
};
