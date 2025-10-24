import { formOptions } from "@tanstack/react-form";
import { OppfolgingsplanFormKanLagresSomUtkast } from "@/schema/oppfolgingsplanFormSchemas";

const initialOppfolgingsplanFormValues: OppfolgingsplanFormKanLagresSomUtkast =
  {
    typiskArbeidshverdag: "",
    arbeidsoppgaverSomKanUtfores: "",
    arbeidsoppgaverSomIkkeKanUtfores: "",
    tidligereTilrettelegging: "",
    tilretteleggingFremover: "",
    annenTilrettelegging: "",
    hvordanFolgeOpp: "",
    evalueringDato: null,
    harDenAnsatteMedvirket: null,
    denAnsatteHarIkkeMedvirketBegrunnelse: "",
  };

export const oppfolgingsplanFormOpts = formOptions({
  defaultValues: initialOppfolgingsplanFormValues,
});
