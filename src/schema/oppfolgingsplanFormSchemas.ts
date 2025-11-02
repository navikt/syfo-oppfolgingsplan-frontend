import { z } from "zod";

const requireFieldErrorMessage = "Feltet må fylles ut";
const TEXT_FIELD_MAX_LENGTH = 2000;
const maxLengthExeededErrorMessage = `Feltet kan ikke ha mer enn ${TEXT_FIELD_MAX_LENGTH} tegn`;

const today = new Date();
const minEvalueringDato = new Date(
  today.getFullYear(),
  today.getMonth(),
  today.getDate() + 1
);
const maxEvalueringDato = new Date(
  today.getFullYear() + 1,
  today.getMonth(),
  today.getDate()
);

export const OppfolgingsplanFormLagreUtkastValidering = z.strictObject({
  typiskArbeidshverdag: z
    .string()
    .max(TEXT_FIELD_MAX_LENGTH, maxLengthExeededErrorMessage)
    .nullable(),
  arbeidsoppgaverSomKanUtfores: z
    .string()
    .max(TEXT_FIELD_MAX_LENGTH, maxLengthExeededErrorMessage)
    .nullable(),
  arbeidsoppgaverSomIkkeKanUtfores: z
    .string()
    .max(TEXT_FIELD_MAX_LENGTH, maxLengthExeededErrorMessage)
    .nullable(),
  tidligereTilrettelegging: z
    .string()
    .max(TEXT_FIELD_MAX_LENGTH, maxLengthExeededErrorMessage)
    .nullable(),
  tilretteleggingFremover: z
    .string()
    .max(TEXT_FIELD_MAX_LENGTH, maxLengthExeededErrorMessage)
    .nullable(),
  annenTilrettelegging: z
    .string()
    .max(TEXT_FIELD_MAX_LENGTH, maxLengthExeededErrorMessage)
    .nullable(),
  hvordanFolgeOpp: z
    .string()
    .max(TEXT_FIELD_MAX_LENGTH, maxLengthExeededErrorMessage)
    .nullable(),
  evalueringDato: z.date().nullable(),
  harDenAnsatteMedvirket: z.enum(["ja", "nei"]).nullable(),
  denAnsatteHarIkkeMedvirketBegrunnelse: z
    .string()
    .max(TEXT_FIELD_MAX_LENGTH, maxLengthExeededErrorMessage)
    .nullable(),
});

export const OppfolgingsplanFormFerdigstillValidering =
  OppfolgingsplanFormLagreUtkastValidering.safeExtend({
    typiskArbeidshverdag: z
      .string()
      .nonempty(requireFieldErrorMessage)
      .max(TEXT_FIELD_MAX_LENGTH, maxLengthExeededErrorMessage),
    arbeidsoppgaverSomKanUtfores: z
      .string()
      .nonempty(requireFieldErrorMessage)
      .max(TEXT_FIELD_MAX_LENGTH, maxLengthExeededErrorMessage),
    arbeidsoppgaverSomIkkeKanUtfores: z
      .string()
      .nonempty(requireFieldErrorMessage)
      .max(TEXT_FIELD_MAX_LENGTH, maxLengthExeededErrorMessage),
    tidligereTilrettelegging: z
      .string()
      .nonempty(requireFieldErrorMessage)
      .max(TEXT_FIELD_MAX_LENGTH, maxLengthExeededErrorMessage),
    tilretteleggingFremover: z
      .string()
      .nonempty(requireFieldErrorMessage)
      .max(TEXT_FIELD_MAX_LENGTH, maxLengthExeededErrorMessage),
    annenTilrettelegging: z
      .string()
      .nonempty(requireFieldErrorMessage)
      .max(TEXT_FIELD_MAX_LENGTH, maxLengthExeededErrorMessage),
    hvordanFolgeOpp: z
      .string()
      .nonempty(requireFieldErrorMessage)
      .max(TEXT_FIELD_MAX_LENGTH, maxLengthExeededErrorMessage),
    evalueringDato: z
      .date({
        error: (issue) =>
          issue.input === null ? requireFieldErrorMessage : "Ugyldig dato",
      })
      .min(
        minEvalueringDato,
        "Dato for evaluering kan ikke være i dag eller tidligere"
      )
      .max(
        maxEvalueringDato,
        "Dato for evaluering kan ikke være mer enn ett år frem i tid"
      ),
    harDenAnsatteMedvirket: z.enum(["ja", "nei"]),
  }).refine(
    ({ harDenAnsatteMedvirket, denAnsatteHarIkkeMedvirketBegrunnelse }) =>
      checkAnsattIkkeMedvirketBegrunnelseIfMedvirketNei(
        harDenAnsatteMedvirket,
        denAnsatteHarIkkeMedvirketBegrunnelse
      ),
    {
      path: ["denAnsatteHarIkkeMedvirketBegrunnelse"],
      message: requireFieldErrorMessage,
    }
  );

function checkAnsattIkkeMedvirketBegrunnelseIfMedvirketNei(
  harDenAnsatteMedvirket: string,
  denAnsatteHarIkkeMedvirketBegrunnelse: string | null
): boolean {
  return (
    harDenAnsatteMedvirket === "ja" ||
    (harDenAnsatteMedvirket === "nei" &&
      (denAnsatteHarIkkeMedvirketBegrunnelse as string)?.trim() !== "")
  );
}
