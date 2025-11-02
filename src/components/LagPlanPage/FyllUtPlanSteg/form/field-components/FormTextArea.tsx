"use client";

import { Box, Textarea } from "@navikt/ds-react";
import { useFieldContext } from "../hooks/form-context";

interface Props {
  label: string;
  description?: React.ReactNode;
  helpText?: React.ReactNode;
  minRows?: number;
  maxLength?: number;
}

export default function FormTextArea({
  label,
  description,
  helpText,
  minRows,
  maxLength = 2000,
}: Props) {
  const field = useFieldContext<string>();

  const errorMessages = field.state.meta.errors
    .map((err) => err.message)
    .join(",");

  const labelNode = helpText ? (
    <Box className="flex gap-2 items-baseline">
      <span>{label}</span>
      {/* <HelpText placement="top">{helpText}</HelpText> */}
    </Box>
  ) : (
    label
  );

  return (
    <Textarea
      id={field.name}
      label={labelNode}
      description={description}
      minRows={minRows ?? 4}
      resize="vertical"
      maxLength={maxLength}
      value={field.state.value}
      error={errorMessages}
      onChange={(e) => field.handleChange(e.target.value)}
      onBlur={field.handleBlur}
      className="mb-6"
    />
  );
}
