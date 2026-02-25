import type { OppfolgingsplanFormUnderArbeid } from "@/schema/oppfolgingsplanForm/formValidationSchemas";
import type { ConvertedLagretUtkastResponse } from "@/schema/utkastResponseSchema";
import { now } from "@/utils/dateAndTime/dateUtils";
import { mockCommonAGResponseFields } from "./mockEmployeeDetails";

const mockLagretUtkast: OppfolgingsplanFormUnderArbeid = {
  typiskArbeidshverdag:
    "Dette skrev jeg forrige gang. Kjekt at det blir lagret i et utkast.",
};

export const mockUtkastResponse: ConvertedLagretUtkastResponse = {
  ...mockCommonAGResponseFields,
  utkast: {
    sistLagretTidspunkt: now().subtract(30, "minute").toISOString(),
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
  evalueringsDato: now().add(2, "month").format("YYYY-MM-DD"),
  harDenAnsatteMedvirket: "ja",
  denAnsatteHarIkkeMedvirketBegrunnelse: "",
};

export const mockUtfyltLagretUtkastResponse: ConvertedLagretUtkastResponse = {
  ...mockCommonAGResponseFields,
  utkast: {
    sistLagretTidspunkt: now().subtract(30, "minute").toISOString(),
    content: mockUtfyltLagretUtkast,
  },
};
