"use client";

import NextLink from "next/link";
import { FilePdfIcon } from "@navikt/aksel-icons";
import { Button } from "@navikt/ds-react";

interface Props {
  className?: string;
  narmesteLederId: string;
  planId: string;
}

export function LastNedSomPdfButtonAG({
  className,
  narmesteLederId,
  planId,
}: Props) {
  return (
    <Button
      variant="tertiary"
      icon={<FilePdfIcon />}
      iconPosition="right"
      className={className}
      as={NextLink}
      href={`/api/${narmesteLederId}/pdf/${planId}`}
    >
      Last ned som PDF
    </Button>
  );
}
