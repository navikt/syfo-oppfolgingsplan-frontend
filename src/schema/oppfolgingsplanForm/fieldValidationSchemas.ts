import z from "zod";
import { TEXT_FIELD_MAX_LENGTH } from "@/common/app-config";
import {
  isNotMoreThanOneYearInTheFuture,
  isTomorrowOrLater,
} from "@/utils/dateAndTime/dateUtils";

export const requireFieldErrorMessage = "Feltet må fylles ut";
const maxLengthExeededErrorMessage = `Feltet kan ikke ha mer enn ${TEXT_FIELD_MAX_LENGTH} tegn`;

// Tekstfelt-verdier initialiseres som tomme strenger. De vil derfor aldri være null.
// Et tomt tekstfelt vil ha tom streng som verdi.
export const nonRequiredMaxLengthTextFieldSchema = z
  .string()
  .max(TEXT_FIELD_MAX_LENGTH, maxLengthExeededErrorMessage);

export const requiredMaxLengthTextFieldSchema = z
  .string()
  .nonempty(requireFieldErrorMessage)
  .max(TEXT_FIELD_MAX_LENGTH, maxLengthExeededErrorMessage);

export const evalueringsDatoFieldInUtfylltFormSchema = z.iso
  .date({
    error: (issue) =>
      issue.input === null ? requireFieldErrorMessage : "Ugyldig dato",
  })
  .refine((dateIsoString) => isTomorrowOrLater(dateIsoString), {
    message: "Dato for evaluering kan ikke være i dag eller tidligere",
  })
  .refine((dateIsoString) => isNotMoreThanOneYearInTheFuture(dateIsoString), {
    message: "Dato for evaluering kan ikke være mer enn ett år frem i tid",
  });
