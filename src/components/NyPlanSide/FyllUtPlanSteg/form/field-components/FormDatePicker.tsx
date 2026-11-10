"use client";

import {
  Box,
  DatePicker,
  InlineMessage,
  useDatepicker,
} from "@navikt/ds-react";
import { logAnalyticsEvent } from "@/common/analytics/logAnalyticsEvent";
import { toDateStringInIsoFormat } from "@/utils/dateAndTime/dateUtils";
import { useFieldContext } from "../hooks/form-context";

interface Props {
  label: string;
  description?: React.ReactNode;
  fromDate: Date;
  toDate: Date;
  isRequired: boolean;
  isChangeDisabled?: boolean;
  isReadOnly?: boolean;
  className?: string;
  infoMessage?: React.ReactNode;
}

export default function FormDatePicker({
  label,
  description,
  fromDate,
  toDate,
  isRequired,
  isChangeDisabled = false,
  isReadOnly = false,
  className,
  infoMessage,
}: Props) {
  const field = useFieldContext<string | undefined>();
  const infoId = infoMessage ? `${field.name}-info` : undefined;

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
        logAnalyticsDatoValgt(dateIsoString);
        field.handleChange(dateIsoString);
      }
    },
  });

  const errorMessages = field.state.meta.errors
    .map((err) => err?.message)
    .join(", ");

  function logAnalyticsDatoValgt(datoVerdi: string) {
    logAnalyticsEvent({
      name: "dato valgt",
      properties: {
        datoFelt: label,
        datoVerdi,
      },
    });
  }

  return (
    <Box className={className}>
      <DatePicker {...datepickerProps}>
        <DatePicker.Input
          {...inputProps}
          id={field.name}
          onBlur={field.handleBlur}
          label={label}
          description={description}
          error={errorMessages}
          readOnly={isReadOnly}
          aria-required={isRequired}
          // Aksel appends its own description and error ids to this value.
          aria-describedby={infoId}
        />
        {infoId && (
          <Box marginBlock="space-8 space-0">
            <InlineMessage status="info" id={infoId}>
              {infoMessage}
            </InlineMessage>
          </Box>
        )}
      </DatePicker>
    </Box>
  );
}
