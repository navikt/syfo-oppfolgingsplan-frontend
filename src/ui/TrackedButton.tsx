"use client";

import { Button, ButtonProps, OverridableComponent } from "@navikt/ds-react";
import { logTaxonomyEvent } from "@/common/logTaxonomyEvent";

interface TrackedButtonOwnProps {
  tracking: {
    komponentId: string;
    tekst: string;
    kontekst: string;
  };
}

export type TrackedButtonProps = ButtonProps & TrackedButtonOwnProps;

export const TrackedButton = (({
  tracking,
  onClick,
  ...props
}: TrackedButtonProps) => {
  return (
    <Button
      {...props}
      onClick={(e) => {
        logTaxonomyEvent({
          name: "knapp klikket",
          properties: {
            komponentId: tracking.komponentId,
            tekst: tracking.tekst,
            kontekst: tracking.kontekst,
            ...(props.variant ? { variant: props.variant } : {}),
          },
        });
        onClick?.(e);
      }}
    />
  );
}) as OverridableComponent<TrackedButtonProps, HTMLButtonElement>;
