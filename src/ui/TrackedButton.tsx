"use client";

import { Button, ButtonProps, OverridableComponent } from "@navikt/ds-react";
import { logAnalyticsEvent } from "@/common/analytics/logAnalyticsEvent";

interface TrackedButtonOwnProps {
  /** Event properties to log for "knapp klikket" analytics event */
  tracking: {
    komponentId: string;
    tekst: string;
    kontekst: string;
  };
}

export type TrackedButtonProps = ButtonProps & TrackedButtonOwnProps;

export const TrackedButton = (({
  tracking: { komponentId, tekst, kontekst },
  onClick,
  ...props
}: TrackedButtonProps) => {
  return (
    <Button
      {...props}
      onClick={(e) => {
        logAnalyticsEvent({
          name: "knapp klikket",
          properties: {
            komponentId,
            tekst,
            kontekst,
            ...(props.variant ? { variant: props.variant } : {}),
          },
        });
        onClick?.(e);
      }}
    />
  );
}) as OverridableComponent<TrackedButtonProps, HTMLButtonElement>;
