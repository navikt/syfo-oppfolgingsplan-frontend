import z from "zod";
import { formOptions } from "@tanstack/react-form";
import { OppfolgingsplanFormLagreUtkastValidering } from "@/schema/oppfolgingsplanFormSchemas";

const initialOppfolgingsplanFormValues: z.infer<
  typeof OppfolgingsplanFormLagreUtkastValidering
> = {
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
