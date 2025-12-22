"use client";

import { DatePicker, useDatepicker } from "@navikt/ds-react";
import { logTaxonomyEvent } from "@/common/logTaxonomyEvent";
import { toDateStringInIsoFormat } from "@/utils/dateAndTime/dateUtils";
import { useFieldContext } from "../hooks/form-context";

interface Props {
  label: string;
  description?: React.ReactNode;
  fromDate: Date;
  toDate: Date;
  isChangeDisabled?: boolean;
  className?: string;
  isReadOnly?: boolean;
}

export default function FormDatePicker({
  label,
  description,
  fromDate,
  toDate,
  isChangeDisabled = false,
  className,
  isReadOnly = false,
}: Props) {
  const field = useFieldContext<string | undefined>();
  const { datepickerProps, inputProps } = useDatepicker({
    fromDate,
    toDate,
    allowTwoDigitYear: false,
    defaultSelected: field.state.value
      ? new Date(field.state.value)
      : undefined,
    onDateChange: (date: Date | undefined) => {
      // TODO: Fiks så endring av dato til dato utenfor fromDate-toDate intervall
      // via tekst input håndteres fornuftig. I disse tilfellene blir date `undefined` her.
      // Og state value for feltet blir visst null. Og feilmelding som vises blir "Feltet må fylles ut."
      if (!isChangeDisabled && date) {
        const dateIsoString = toDateStringInIsoFormat(date);
        logTaxonomyEvent({
          name: "dato valgt",
          properties: {
            datoFelt: label,
            datoVerdi: dateIsoString,
          },
        });
        field.handleChange(dateIsoString);
      }
    },
  });

  const errorMessages = field.state.meta.errors
    .map((err) => err?.message)
    .join(", ");

  return (
    <DatePicker {...datepickerProps}>
      <DatePicker.Input
        {...inputProps}
        id={field.name}
        onBlur={field.handleBlur}
        label={label}
        description={description}
        error={errorMessages}
        className={className}
        readOnly={isReadOnly}
      />
    </DatePicker>
  );
}
