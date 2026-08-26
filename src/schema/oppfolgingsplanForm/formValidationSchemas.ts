import { z } from "zod";
import {
  evalueringsDatoFieldInUtfylltFormSchema,
  nonRequiredMaxLengthTextFieldSchema,
  requiredMaxLengthTextFieldSchema,
  requireFieldErrorMessage,
} from "./fieldValidationSchemas";

export type OppfolgingsplanFormUnderArbeid = z.infer<
  typeof oppfolgingsplanFormUnderArbeidSchema
>;
export type OppfolgingsplanFormUtfyllt = z.infer<
  typeof oppfolgingsplanFormUtfylltSchema
>;
export type OppfolgingsplanFormUtfylltMedEvalueringPaaminnelse = z.infer<
  typeof oppfolgingsplanFormUtfylltMedEvalueringPaaminnelseSchema
>;

/**
 * Zod-schema for validering av form ved lagring av utkast.
 * Alle felter er valgfrie fra brukerperspektiv ved lagring av utkast. Tomme
 * tekstfelter vil ha tomme strenger som verdi.
 */
export const oppfolgingsplanFormUnderArbeidSchema = z
  .object({
    typiskArbeidshverdag: nonRequiredMaxLengthTextFieldSchema,
    arbeidsoppgaverSomKanUtfores: nonRequiredMaxLengthTextFieldSchema,
    arbeidsoppgaverSomIkkeKanUtfores: nonRequiredMaxLengthTextFieldSchema,
    tidligereTilrettelegging: nonRequiredMaxLengthTextFieldSchema,
    tilretteleggingFremover: nonRequiredMaxLengthTextFieldSchema,
    annenTilrettelegging: nonRequiredMaxLengthTextFieldSchema,
    hvordanFolgeOpp: nonRequiredMaxLengthTextFieldSchema,
    evalueringsDato: z.iso.date().nullable(),
    evalueringPaaminnelse: z.enum(["true", "false"]).nullable(),
    harDenAnsatteMedvirket: z.enum(["ja", "nei"]).nullable(),
    denAnsatteHarIkkeMedvirketBegrunnelse: nonRequiredMaxLengthTextFieldSchema,
  })
  .partial();

/**
 * Zod-schema for validering av form ved ferdigstilling av plan.
 * Denne valideringen er strengere enn ved lagring av utkast.
 */
const oppfolgingsplanFormUtfylltBaseSchema = z.object({
  typiskArbeidshverdag: requiredMaxLengthTextFieldSchema,
  arbeidsoppgaverSomKanUtfores: requiredMaxLengthTextFieldSchema,
  arbeidsoppgaverSomIkkeKanUtfores: requiredMaxLengthTextFieldSchema,
  tidligereTilrettelegging: requiredMaxLengthTextFieldSchema,
  tilretteleggingFremover: requiredMaxLengthTextFieldSchema,
  annenTilrettelegging: requiredMaxLengthTextFieldSchema,
  hvordanFolgeOpp: requiredMaxLengthTextFieldSchema,
  evalueringsDato: evalueringsDatoFieldInUtfylltFormSchema,
  harDenAnsatteMedvirket: z.enum(["ja", "nei"], {
    error: "Du må svare ja eller nei",
  }),
  denAnsatteHarIkkeMedvirketBegrunnelse: nonRequiredMaxLengthTextFieldSchema,
});

export const oppfolgingsplanFormUtfylltSchema =
  oppfolgingsplanFormUtfylltBaseSchema.refine(
    ({ harDenAnsatteMedvirket, denAnsatteHarIkkeMedvirketBegrunnelse }) =>
      checkAnsattIkkeMedvirketBegrunnelseIfMedvirketNei(
        harDenAnsatteMedvirket,
        denAnsatteHarIkkeMedvirketBegrunnelse,
      ),
    {
      message: requireFieldErrorMessage,
      path: ["denAnsatteHarIkkeMedvirketBegrunnelse"],
      when(payload) {
        return oppfolgingsplanFormUtfylltBaseSchema
          .pick({
            harDenAnsatteMedvirket: true,
          })
          .safeParse(payload.value).success;
      },
    },
  );

export const oppfolgingsplanFormUtfylltMedEvalueringPaaminnelseSchema =
  oppfolgingsplanFormUtfylltSchema.extend({
    evalueringPaaminnelse: z.enum(["true", "false"], {
      error: "Du må svare ja eller nei på om du ønsker en påminnelse på e-post",
    }),
  });

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
