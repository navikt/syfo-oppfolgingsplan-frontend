import { OppfolgingsplanForm } from "@/schema/oppfolgingsplanFormSchemas";
import { UtkastData } from "../arbeidsgiver/fetchUtkastPlanForAG";

const mockSavedFormValues: OppfolgingsplanForm = {
  typiskArbeidshverdag:
    "Dette skrev jeg forrige gang. Kjekt at det blir lagret i et utkast!",
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

export const mockUtkastData: UtkastData = {
  savedFormValues: mockSavedFormValues,
  lastSavedTime: new Date(Date.now() - 30 * 60 * 1000),
};
