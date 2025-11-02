"use client";

import { ReactNode } from "react";
import { Radio, RadioGroup, Stack } from "@navikt/ds-react";
import { useFieldContext } from "../hooks/form-context";

interface Props {
  label: string;
  description?: ReactNode;
  options: {
    value: string;
    label: string;
  }[];
  showHorizontally?: boolean;
  className?: string;
}

export default function FormRadioGroup({
  label,
  description,
  options,
  showHorizontally = false,
  className,
}: Props) {
  const field = useFieldContext<string>();

  const errorMessages = field.state.meta.errors
    .map((err) => err.message)
    .join(",");

  const handleChange = (value: string) => {
    field.setValue(value);
  };

  const radioElements = options.map((option) => (
    <Radio key={option.value} value={option.value}>
      {option.label}
    </Radio>
  ));

  return (
    <RadioGroup
      legend={label}
      description={description}
      error={errorMessages}
      value={field.state.value}
      onChange={handleChange}
      className={className}
    >
      {showHorizontally ? (
        <Stack gap="0 6" direction={{ xs: "column", sm: "row" }} wrap={false}>
          {radioElements}
        </Stack>
      ) : (
        radioElements
      )}
    </RadioGroup>
  );
}
