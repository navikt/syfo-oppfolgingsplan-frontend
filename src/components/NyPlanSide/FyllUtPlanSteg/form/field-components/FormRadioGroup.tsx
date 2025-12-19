"use client";

import { ReactNode } from "react";
import { Radio, RadioGroup } from "@navikt/ds-react";
import { logTaxonomyEvent } from "@/common/logTaxonomyEvent";
import { useFieldContext } from "../hooks/form-context";

interface Props {
  label: string;
  description?: ReactNode;
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
    logTaxonomyEvent({
      name: "radio valg endret",
      properties: {
        komponentId: label,
        valgtAlternativ: value,
        antallAlternativer: options.length,
      },
    });
    field.setValue(value);
  };

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
    >
      {options.map((option) => (
        <Radio key={option.value} value={option.value}>
          {option.label}
        </Radio>
      ))}
    </RadioGroup>
  );
}
