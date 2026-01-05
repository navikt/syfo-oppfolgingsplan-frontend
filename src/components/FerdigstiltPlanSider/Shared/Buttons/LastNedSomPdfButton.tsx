"use client";

import NextLink from "next/link";
import { FilePdfIcon } from "@navikt/aksel-icons";
import { TrackedButton } from "@/ui/TrackedButton";

interface Props {
  className?: string;
  narmesteLederId: string;
  planId: string;
}

export function LastNedSomPdfButton({
  className,
  narmesteLederId,
  planId,
}: Props) {
  return (
    <TrackedButton
      variant="tertiary"
      icon={<FilePdfIcon />}
      iconPosition="right"
      className={className}
      tracking={{
        komponentId: "last-ned-som-pdf-knapp",
        tekst: "Last ned som PDF",
        kontekst: "FerdigstiltPlanSide",
      }}
      as={NextLink}
      href={`/api/${narmesteLederId}/pdf/${planId}`}
      target="_blank"
    >
      Last ned som PDF
    </TrackedButton>
  );
}
