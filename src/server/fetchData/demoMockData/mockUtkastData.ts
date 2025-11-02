import { OppfolgingsplanForm } from "@/schema/oppfolgingsplanFormSchemas";
import { UtkastData } from "../fetchUtkastPlan";

const mockSavedFormValues: OppfolgingsplanForm = {
  typiskArbeidshverdag: "",
  arbeidsoppgaverSomKanUtfores: "utkast tekst",
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
