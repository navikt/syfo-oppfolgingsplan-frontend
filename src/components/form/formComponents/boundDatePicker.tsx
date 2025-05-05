import { DatePicker, useDatepicker } from "@navikt/ds-react";
import { useFieldContext } from "@/components/form/hooks/form-context.tsx";
import React from "react";

interface Props {
  label: string;
  description: string;
  fromDate: Date;
  toDate: Date;
}

export const BoundDatePicker = ({
  label,
  description,
  fromDate,
  toDate,
}: Props) => {
  const field = useFieldContext<Date | undefined>();
  const { datepickerProps, inputProps } = useDatepicker({
    fromDate: fromDate,
    toDate: toDate,
    allowTwoDigitYear: false,
    defaultSelected: field.state.value,
    onDateChange: (date: Date | undefined) => {
      field.handleChange(date);
    },
  });

  const errorMessages =
    field.state.meta.isTouched &&
    field.state.meta.errors.map((err) => err.message).join(",");

  return (
    <>
      <DatePicker {...datepickerProps}>
        <DatePicker.Input
          {...inputProps}
          label={label}
          description={description}
          error={errorMessages}
        />
      </DatePicker>
    </>
  );
};
