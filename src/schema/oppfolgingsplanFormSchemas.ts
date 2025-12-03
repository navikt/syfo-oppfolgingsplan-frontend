import { z } from "zod";
import { TEXT_FIELD_MAX_LENGTH } from "@/common/app-config";
import {
  getOneYearFromNowDate,
  getTomorrowDate,
  isValidDate,
} from "@/utils/dateUtils";

const requireFieldErrorMessage = "Feltet må fylles ut";
const maxLengthExeededErrorMessage = `Feltet kan ikke ha mer enn ${TEXT_FIELD_MAX_LENGTH} tegn`;

export type OppfolgingsplanFormUnderArbeid = z.infer<
  typeof OppfolgingsplanFormAndUtkastSchema
>;
export type OppfolgingsplanForm = z.infer<
  typeof OppfolgingsplanFormFerdigstillSchema
>;

// Form field values for text fields will start as empty strings, so they can't be null.
const schemaForNonRequiredMaxLengthTextField = z
  .string()
  .max(TEXT_FIELD_MAX_LENGTH, maxLengthExeededErrorMessage);

const schemaForRequiredMaxLengthTextField = z
  .string()
  .nonempty(requireFieldErrorMessage)
  .max(TEXT_FIELD_MAX_LENGTH, maxLengthExeededErrorMessage);

/**
 * Zod-schema for validering av form ved lagring av utkast.
 * Alle felter er valgfrie fra brukerperspektiv ved lagring av utkast.
 */
export const OppfolgingsplanFormAndUtkastSchema = z
  .object({
    typiskArbeidshverdag: schemaForNonRequiredMaxLengthTextField,
    arbeidsoppgaverSomKanUtfores: schemaForNonRequiredMaxLengthTextField,
    arbeidsoppgaverSomIkkeKanUtfores: schemaForNonRequiredMaxLengthTextField,
    tidligereTilrettelegging: schemaForNonRequiredMaxLengthTextField,
    tilretteleggingFremover: schemaForNonRequiredMaxLengthTextField,
    annenTilrettelegging: schemaForNonRequiredMaxLengthTextField,
    hvordanFolgeOpp: schemaForNonRequiredMaxLengthTextField,
    evalueringsDato: z.iso.date().nullable(),
    harDenAnsatteMedvirket: z.enum(["ja", "nei"]).nullable(),
    denAnsatteHarIkkeMedvirketBegrunnelse:
      schemaForNonRequiredMaxLengthTextField,
  })
  .partial();

const schemaForEvalueringsDatoVedFerdigstilling = z.iso
  .date({
    error: (issue) =>
      issue.input === null ? requireFieldErrorMessage : "Ugyldig dato",
  })
  .refine(
    (dateString) => {
      const minDate = getTomorrowDate();
      const parsedDate = new Date(dateString);
      return (
        isValidDate(parsedDate) && parsedDate.getTime() >= minDate.getTime()
      );
    },
    {
      message: "Dato for evaluering kan ikke være i dag eller tidligere",
    },
  )
  .refine(
    (dateString) => {
      const maxDate = getOneYearFromNowDate();
      const parsedDate = new Date(dateString);
      return (
        isValidDate(parsedDate) && parsedDate.getTime() <= maxDate.getTime()
      );
    },
    {
      message: "Dato for evaluering kan ikke være mer enn ett år frem i tid",
    },
  );

/**
 * Zod-schema for validering av form ved ferdigstilling av plan.
 * Denne valideringen er strengere enn ved lagring av utkast.
 */
export const OppfolgingsplanFormFerdigstillSchema = z
  .object({
    typiskArbeidshverdag: schemaForRequiredMaxLengthTextField,
    arbeidsoppgaverSomKanUtfores: schemaForRequiredMaxLengthTextField,
    arbeidsoppgaverSomIkkeKanUtfores: schemaForRequiredMaxLengthTextField,
    tidligereTilrettelegging: schemaForRequiredMaxLengthTextField,
    tilretteleggingFremover: schemaForRequiredMaxLengthTextField,
    annenTilrettelegging: schemaForRequiredMaxLengthTextField,
    hvordanFolgeOpp: schemaForRequiredMaxLengthTextField,
    evalueringsDato: schemaForEvalueringsDatoVedFerdigstilling,
    harDenAnsatteMedvirket: z.enum(["ja", "nei"], {
      error: "Du må svare ja eller nei",
    }),
    denAnsatteHarIkkeMedvirketBegrunnelse:
      schemaForNonRequiredMaxLengthTextField,
  })
  .refine(
    ({ harDenAnsatteMedvirket, denAnsatteHarIkkeMedvirketBegrunnelse }) =>
      checkAnsattIkkeMedvirketBegrunnelseIfMedvirketNei(
        harDenAnsatteMedvirket,
        denAnsatteHarIkkeMedvirketBegrunnelse,
      ),
    {
      message: requireFieldErrorMessage,
      path: ["denAnsatteHarIkkeMedvirketBegrunnelse"],
      when(payload) {
        return OppfolgingsplanFormFerdigstillSchema.pick({
          harDenAnsatteMedvirket: true,
        }).safeParse(payload.value).success;
      },
    },
  );

function checkAnsattIkkeMedvirketBegrunnelseIfMedvirketNei(
  harDenAnsatteMedvirket: string,
  denAnsatteHarIkkeMedvirketBegrunnelse: string,
): boolean {
  return (
    harDenAnsatteMedvirket === "ja" ||
    (harDenAnsatteMedvirket === "nei" &&
      denAnsatteHarIkkeMedvirketBegrunnelse.trim() !== "")
  );
}
