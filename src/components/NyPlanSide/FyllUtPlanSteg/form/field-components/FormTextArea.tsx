"use client";

import { Textarea } from "@navikt/ds-react";
import { logAnalyticsEvent } from "@/common/analytics/logAnalyticsEvent";
import { TEXT_FIELD_MAX_LENGTH } from "@/common/app-config";
import { useFieldContext } from "../hooks/form-context";

interface Props {
  label: string;
  description?: React.ReactNode;
  minRows?: number;
  maxLength?: number;
  isRequired: boolean;
  isChangeDisabled?: boolean;
  isReadOnly?: boolean;
}

export default function FormTextArea({
  label,
  description,
  minRows,
  maxLength = TEXT_FIELD_MAX_LENGTH,
  isRequired,
  isChangeDisabled = false,
  isReadOnly = false,
}: Props) {
  const field = useFieldContext<string>();

  const errorMessages = field.state.meta.errors
    .map((err) => err?.message)
    .join(", ");

  function logAnalyticsTextareaUtfylt() {
    logAnalyticsEvent({
      name: "textarea utfylt",
      properties: {
        feltNavn: label,
        harVerdi: field.state.value.length > 0,
        tegnlengde: field.state.value.length,
      },
    });
  }

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
      onBlur={() => {
        logAnalyticsTextareaUtfylt();
        field.handleBlur();
      }}
      readOnly={isReadOnly}
      aria-required={isRequired}
      className="mb-6"
    />
  );
}
