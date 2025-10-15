import { formOptions } from "@tanstack/react-form";
import { OppfolgingsplanUnderUtfylling } from "@/schema/oppfolgingsplanFormSchema";

const defaultOppfolgingsplanFormValues: OppfolgingsplanUnderUtfylling = {
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
  defaultValues: defaultOppfolgingsplanFormValues,
});
