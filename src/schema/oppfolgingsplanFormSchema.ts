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

export const OppfolgingsplanFormValidationSchema = z
  .object({
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
          // TODO: teste hvordan dette slår ut
          issue.input === undefined ? requireFieldErrorMessage : "Ugyldig dato",
      })
      .min(
        minEvalueringDato,
        "Dato for evaluering kan ikke være i dag eller tidligere"
      )
      .max(
        maxEvalueringDato,
        "Dato for evaluering kan ikke være mer enn ett år frem i tid"
      ),
    // TODO: fix not optional
    harDenAnsatteMedvirket: z.enum(["ja", "nei"]).default("ja").optional(),
    denAnsatteHarIkkeMedvirketBegrunnelse: z
      .string()
      .max(TEXT_FIELD_MAX_LENGTH, maxLengthExeededErrorMessage),
  })
  .refine(
    ({ harDenAnsatteMedvirket, denAnsatteHarIkkeMedvirketBegrunnelse }) =>
      harDenAnsatteMedvirket === "ja" ||
      (harDenAnsatteMedvirket === "nei" &&
        (denAnsatteHarIkkeMedvirketBegrunnelse as string)?.trim() !== ""),
    {
      path: ["denAnsatteHarIkkeMedvirketBegrunnelse"],
      message: requireFieldErrorMessage,
    }
  );

// TODO: se om konseptet med input og output schemas kan brukes i stedet her
export type OppfolgingsplanInnhold = Omit<
  z.infer<typeof OppfolgingsplanFormValidationSchema>,
  "evalueringDato"
> & {
  // Feltet har ikke en verdi når man oppretter en ny plan
  evalueringDato: Date | null;
};
