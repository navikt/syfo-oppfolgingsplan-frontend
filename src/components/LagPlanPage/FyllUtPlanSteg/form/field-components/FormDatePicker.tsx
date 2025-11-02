"use client";

import { DatePicker, useDatepicker } from "@navikt/ds-react";
import { useFieldContext } from "../hooks/form-context";

interface Props {
  label: string;
  description?: React.ReactNode;
  fromDate: Date;
  toDate: Date;
  className?: string;
}

export default function FormDatePicker({
  label,
  description,
  fromDate,
  toDate,
  className,
}: Props) {
  const field = useFieldContext<Date | undefined>();
  const { datepickerProps, inputProps } = useDatepicker({
    fromDate,
    toDate,
    allowTwoDigitYear: false,
    defaultSelected: field.state.value,
    onDateChange: (date: Date | undefined) => {
      field.handleChange(date);
    },
  });

  const errorMessages = field.state.meta.errors
    .map((err) => err.message)
    .join(",");

  // TODO: Fiks så endring av dato med tekst-input til dato utenfor range håndteres fornuftig, nå bare ignoreres det
  return (
    <>
      <DatePicker {...datepickerProps}>
        <DatePicker.Input
          {...inputProps}
          label={label}
          description={description}
          error={errorMessages}
          className={className}
        />
      </DatePicker>
    </>
  );
}
