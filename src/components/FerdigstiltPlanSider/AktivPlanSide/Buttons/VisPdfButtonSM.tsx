"use client";

import { FilePdfIcon } from "@navikt/aksel-icons";
import NextLink from "next/link";
import { knappKlikket } from "@/common/analytics/events-and-properties/knappKlikket-properties";
import { TrackedButton } from "@/ui/TrackedButton";

interface Props {
  className?: string;
  planId: string;
}

export function VisPdfButtonSM({ className, planId }: Props) {
  return (
    <TrackedButton
      variant="tertiary"
      icon={<FilePdfIcon />}
      iconPosition="right"
      className={className}
      tracking={knappKlikket.ferdigstiltPlanSide.visPdfSykmeldt}
      as={NextLink}
      href={`/api/sykmeldt/pdf/${planId}`}
      target="_blank"
    >
      Vis PDF
    </TrackedButton>
  );
}
