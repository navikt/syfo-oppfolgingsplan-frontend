import { OppfolgingsplanFormUnderArbeid } from "@/schema/oppfolgingsplanFormSchemas";

export const oppfolgingsplanFormDefaultValues: OppfolgingsplanFormUnderArbeid =
  {
    typiskArbeidshverdag: "",
    arbeidsoppgaverSomKanUtfores: "",
    arbeidsoppgaverSomIkkeKanUtfores: "",
    tidligereTilrettelegging: "",
    tilretteleggingFremover: "",
    annenTilrettelegging: "",
    hvordanFolgeOpp: "",
    evalueringsDato: null,
    harDenAnsatteMedvirket: null,
    denAnsatteHarIkkeMedvirketBegrunnelse: "",
  };
