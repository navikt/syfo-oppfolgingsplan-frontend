import { OppfolgingsplanForm } from "@/schema/oppfolgingsplanFormSchemas";
import { UtkastData } from "../arbeidsgiver/fetchUtkastPlanForAG";

const mockSavedFormValues: OppfolgingsplanForm = {
  typiskArbeidshverdag:
    "Dette skrev jeg forrige gang. Kjekt at det blir lagret i et utkast.",
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

const mockSavedFormValuesFilled: OppfolgingsplanForm = {
  typiskArbeidshverdag:
    "Dette skrev jeg forrige gang. Kjekt at det blir lagret i et utkast.",
  arbeidsoppgaverSomKanUtfores: ".",
  arbeidsoppgaverSomIkkeKanUtfores: ".",
  tidligereTilrettelegging: ".",
  tilretteleggingFremover: ".",
  annenTilrettelegging: ".",
  hvordanFolgeOpp: ".",
  evalueringDato: (() => {
    const d = new Date();
    d.setMonth(d.getMonth() + 2);
    return d;
  })(),
  harDenAnsatteMedvirket: "ja",
  denAnsatteHarIkkeMedvirketBegrunnelse: "",
};

export const mockUtkastDataFilled: UtkastData = {
  savedFormValues: mockSavedFormValuesFilled,
  lastSavedTime: new Date(Date.now() - 5 * 60 * 1000),
};
