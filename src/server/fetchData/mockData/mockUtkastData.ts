import { OppfolgingsplanFormUnderArbeid } from "@/schema/oppfolgingsplanFormSchemas";
import { ConvertedLagretUtkastData } from "@/schema/utkastResponseSchema";
import { toLocalDateStringInIsoFormat } from "@/utils/dateUtils";
import { mockCommonAGResponseFields } from "./mockEmployeeDetails";

const mockLagretUtkast: OppfolgingsplanFormUnderArbeid = {
  typiskArbeidshverdag:
    "Dette skrev jeg forrige gang. Kjekt at det blir lagret i et utkast.",
};

export const mockUtkastResponse: ConvertedLagretUtkastData = {
  ...mockCommonAGResponseFields,
  utkast: {
    sistLagretTidspunkt: new Date(Date.now() - 30 * 60 * 1000),
    content: mockLagretUtkast,
  },
};

const mockUtfyltLagretUtkast: OppfolgingsplanFormUnderArbeid = {
  typiskArbeidshverdag:
    "Dette skrev jeg forrige gang. Kjekt at det blir lagret i et utkast.",
  arbeidsoppgaverSomKanUtfores: ".",
  arbeidsoppgaverSomIkkeKanUtfores: ".",
  tidligereTilrettelegging: ".",
  tilretteleggingFremover: ".",
  annenTilrettelegging: ".",
  hvordanFolgeOpp: ".",
  evalueringsDato: (() => {
    const d = new Date();
    d.setMonth(d.getMonth() + 2);
    return toLocalDateStringInIsoFormat(d);
  })(),
  harDenAnsatteMedvirket: "ja",
  denAnsatteHarIkkeMedvirketBegrunnelse: "",
};

export const mockUtfyltLagretUtkastResponse: ConvertedLagretUtkastData = {
  ...mockCommonAGResponseFields,
  utkast: {
    sistLagretTidspunkt: new Date(Date.now() - 5 * 60 * 1000),
    content: mockUtfyltLagretUtkast,
  },
};
