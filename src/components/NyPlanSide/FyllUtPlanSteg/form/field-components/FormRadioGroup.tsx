"use client";

import { Radio, RadioGroup } from "@navikt/ds-react";
import type { ReactNode } from "react";
import { logAnalyticsEvent } from "@/common/analytics/logAnalyticsEvent";
import { useFieldContext } from "../hooks/form-context";

interface Props {
  label: string;
  description?: ReactNode;
  isRequired: boolean;
  options: {
    value: string;
    label: string;
  }[];
  isChangeDisabled?: boolean;
  isReadOnly?: boolean;
  className?: string;
}

export default function FormRadioGroup({
  label,
  description,
  isRequired,
  options,
  isChangeDisabled = false,
  isReadOnly = false,
  className,
}: Props) {
  const field = useFieldContext<string>();

  const errorMessages = field.state.meta.errors
    .map((err) => err?.message)
    .join(", ");

  const handleChange = (value: string) => {
    logAnalyticsRadioValgEndret(value);
    field.setValue(value);
  };

  function logAnalyticsRadioValgEndret(value: string) {
    logAnalyticsEvent({
      name: "radio valg endret",
      properties: {
        komponentId: label,
        valgtAlternativ: value,
        antallAlternativer: options.length,
      },
    });
  }

  return (
    <RadioGroup
      id={field.name}
      legend={label}
      description={description}
      error={errorMessages}
      value={field.state.value}
      onChange={!isChangeDisabled ? handleChange : undefined}
      onBlur={field.handleBlur}
      className={className}
      disabled={isReadOnly}
      aria-required={isRequired}
    >
      {options.map((option) => (
        <Radio key={option.value} value={option.value}>
          {option.label}
        </Radio>
      ))}
    </RadioGroup>
  );
}
