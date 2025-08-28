import { formOptions } from "@tanstack/react-form";
import { OppfolgingsplanFormFields } from "@/schema/oppfolgingsplanFormSchema.ts";

const defaultOppfolgingsplanValues: OppfolgingsplanFormFields = {
  typiskArbeidshverdag: "",
  arbeidsoppgaverSomKanUtfores: "",
  arbeidsoppgaverSomIkkeKanUtfores: "",
  tidligereTilretteleggingBeskrivelse: "",
  tilretteleggingIDennePerioden: "",
  sykmeldtesVurdering: "",
  oppfolging: "",
  evalueringsdato: null,
};

export const oppfolgingsplanFormOpts = formOptions({
  defaultValues: defaultOppfolgingsplanValues,
});
