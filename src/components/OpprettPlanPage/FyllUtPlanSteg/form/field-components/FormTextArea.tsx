"use client";

import { Textarea } from "@navikt/ds-react";
import { TEXT_FIELD_MAX_LENGTH } from "@/constants/app-config";
import { useFieldContext } from "../hooks/form-context";

interface Props {
  label: string;
  description?: React.ReactNode;
  minRows?: number;
  maxLength?: number;
  isChangeDisabled?: boolean;
}

export default function FormTextArea({
  label,
  description,
  minRows,
  maxLength = TEXT_FIELD_MAX_LENGTH,
  isChangeDisabled = false,
}: Props) {
  const field = useFieldContext<string>();

  const errorMessages = field.state.meta.errors
    .map((err) => err?.message)
    .join(", ");

  return (
    <Textarea
      id={field.name}
      label={label}
      description={description}
      minRows={minRows ?? 4}
      resize="vertical"
      maxLength={maxLength}
      value={field.state.value}
      error={errorMessages}
      onChange={(e) =>
        !isChangeDisabled ? field.handleChange(e.target.value) : null
      }
      onBlur={field.handleBlur}
      className="mb-6"
    />
  );
}
