"use client";

import { DatePicker, useDatepicker } from "@navikt/ds-react";
import { useFieldContext } from "../hooks/form-context";

interface Props {
  label: string;
  description?: React.ReactNode;
  fromDate: Date;
  toDate: Date;
  isChangeDisabled?: boolean;
  className?: string;
}

export default function FormDatePicker({
  label,
  description,
  fromDate,
  toDate,
  isChangeDisabled = false,
  className,
}: Props) {
  const field = useFieldContext<Date | undefined>();
  const { datepickerProps, inputProps } = useDatepicker({
    fromDate,
    toDate,
    allowTwoDigitYear: false,
    defaultSelected: field.state.value,
    onDateChange: (date: Date | undefined) => {
      // TODO: Fiks så endring av dato til dato utenfor fromDate-toDate intervall
      // via tekst input håndteres fornuftig. I disse tilfellene blir date `undefined` her.
      // Og state value for feltet blir visst null. Og feilmelding som vises blir "Feltet må fylles ut."
      if (!isChangeDisabled) field.handleChange(date);
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
      />
    </DatePicker>
  );
}
