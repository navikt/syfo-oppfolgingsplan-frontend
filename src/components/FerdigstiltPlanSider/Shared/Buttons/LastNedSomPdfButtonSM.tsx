"use client";

import NextLink from "next/link";
import { FilePdfIcon } from "@navikt/aksel-icons";
import { Button } from "@navikt/ds-react";

interface Props {
  className?: string;
  planId: string;
}

export function LastNedSomPdfButtonSM({ className, planId }: Props) {
  return (
    <Button
      variant="tertiary"
      icon={<FilePdfIcon />}
      iconPosition="right"
      className={className}
      as={NextLink}
      href={`/api/sykmeldt/pdf/${planId}`}
    >
      Last ned som PDF
    </Button>
  );
}
