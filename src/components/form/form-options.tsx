import { formOptions } from "@tanstack/react-form";
import { OppfolgingsplanInnhold } from "@/schema/oppfolgingsplanFormSchema";

const defaultOppfolgingsplanValues: OppfolgingsplanInnhold = {
  typiskArbeidshverdag: "",
  arbeidsoppgaverSomKanUtfores: "",
  arbeidsoppgaverSomIkkeKanUtfores: "",
  tidligereTilrettelegging: "",
  tilretteleggingFremover: "",
  annenTilrettelegging: "",
  hvordanFolgeOpp: "",
  evalueringDato: null,
  harDenAnsatteMedvirket: "ja",
  denAnsatteHarIkkeMedvirketBegrunnelse: "",
};

export const oppfolgingsplanFormOpts = formOptions({
  defaultValues: defaultOppfolgingsplanValues,
});
