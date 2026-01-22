"use client";

import NextLink from "next/link";
import { FilePdfIcon } from "@navikt/aksel-icons";
import { knappKlikket } from "@/common/analytics/events-and-properties/knappKlikket-properties";
import { TrackedButton } from "@/ui/TrackedButton";

interface Props {
  className?: string;
  narmesteLederId: string;
  planId: string;
}

export function VisPdfButtonAG({ className, narmesteLederId, planId }: Props) {
  return (
    <TrackedButton
      variant="tertiary"
      icon={<FilePdfIcon />}
      iconPosition="right"
      className={className}
      tracking={knappKlikket.ferdigstiltPlanSide.visPdfArbeidsgiver}
      as={NextLink}
      href={`/api/${narmesteLederId}/pdf/${planId}`}
      target="_blank"
    >
      Vis PDF
    </TrackedButton>
  );
}
