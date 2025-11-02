import { z } from "zod";

const requireFieldErrorMessage = "Feltet må fylles ut";
const TEXT_FIELD_MAX_LENGTH = 2000;
const maxLengthExeededErrorMessage = `Feltet kan ikke ha mer enn ${TEXT_FIELD_MAX_LENGTH} tegn`;

const today = new Date();
const tomorrow = new Date(
  today.getFullYear(),
  today.getMonth(),
  today.getDate() + 1
);
const oneYearFromNow = new Date(
  today.getFullYear() + 1,
  today.getMonth(),
  today.getDate()
);

export type OppfolgingsplanForm = z.infer<
  typeof OppfolgingsplanFormLagreUtkastValidering
>;

// Form field values for text fields will start as empty strings, so they can't be null.
const schemaForNonRequiredMaxLengthTextField = z
  .string()
  .max(TEXT_FIELD_MAX_LENGTH, maxLengthExeededErrorMessage);

const schemaForRequiredMaxLengthTextField = z
  .string()
  .nonempty(requireFieldErrorMessage)
  .max(TEXT_FIELD_MAX_LENGTH, maxLengthExeededErrorMessage);

export const OppfolgingsplanFormLagreUtkastValidering = z.object({
  typiskArbeidshverdag: schemaForNonRequiredMaxLengthTextField,
  arbeidsoppgaverSomKanUtfores: schemaForNonRequiredMaxLengthTextField,
  arbeidsoppgaverSomIkkeKanUtfores: schemaForNonRequiredMaxLengthTextField,
  tidligereTilrettelegging: schemaForNonRequiredMaxLengthTextField,
  tilretteleggingFremover: schemaForNonRequiredMaxLengthTextField,
  annenTilrettelegging: schemaForNonRequiredMaxLengthTextField,
  hvordanFolgeOpp: schemaForNonRequiredMaxLengthTextField,
  evalueringDato: z.date().nullable(),
  harDenAnsatteMedvirket: z.enum(["ja", "nei"]).nullable(),
  denAnsatteHarIkkeMedvirketBegrunnelse: schemaForNonRequiredMaxLengthTextField,
});

export const OppfolgingsplanFormFerdigstillValidering =
  OppfolgingsplanFormLagreUtkastValidering.safeExtend({
    typiskArbeidshverdag: schemaForRequiredMaxLengthTextField,
    arbeidsoppgaverSomKanUtfores: schemaForRequiredMaxLengthTextField,
    arbeidsoppgaverSomIkkeKanUtfores: schemaForRequiredMaxLengthTextField,
    tidligereTilrettelegging: schemaForRequiredMaxLengthTextField,
    tilretteleggingFremover: schemaForRequiredMaxLengthTextField,
    annenTilrettelegging: schemaForRequiredMaxLengthTextField,
    hvordanFolgeOpp: schemaForRequiredMaxLengthTextField,
    evalueringDato: z
      .date({
        error: (issue) =>
          issue.input === null ? requireFieldErrorMessage : "Ugyldig dato",
      })
      .min(tomorrow, "Dato for evaluering kan ikke være i dag eller tidligere")
      .max(
        oneYearFromNow,
        "Dato for evaluering kan ikke være mer enn ett år frem i tid"
      ),
    harDenAnsatteMedvirket: z.enum(["ja", "nei"], {
      error: "Du må svare ja eller nei",
    }),
    denAnsatteHarIkkeMedvirketBegrunnelse:
      schemaForNonRequiredMaxLengthTextField, // TODO: test
  }).refine(
    ({ harDenAnsatteMedvirket, denAnsatteHarIkkeMedvirketBegrunnelse }) =>
      checkAnsattIkkeMedvirketBegrunnelseIfMedvirketNei(
        harDenAnsatteMedvirket,
        denAnsatteHarIkkeMedvirketBegrunnelse
      ),
    {
      message: requireFieldErrorMessage,
      path: ["denAnsatteHarIkkeMedvirketBegrunnelse"],
      when(payload) {
        return OppfolgingsplanFormFerdigstillValidering.pick({
          harDenAnsatteMedvirket: true,
        }).safeParse(payload.value).success;
      },
    }
  );

function checkAnsattIkkeMedvirketBegrunnelseIfMedvirketNei(
  harDenAnsatteMedvirket: string,
  denAnsatteHarIkkeMedvirketBegrunnelse: string
): boolean {
  return (
    harDenAnsatteMedvirket === "ja" ||
    (harDenAnsatteMedvirket === "nei" &&
      denAnsatteHarIkkeMedvirketBegrunnelse.trim() !== "")
  );
}
