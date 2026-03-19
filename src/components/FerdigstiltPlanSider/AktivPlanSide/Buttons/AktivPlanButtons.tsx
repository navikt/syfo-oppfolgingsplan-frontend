"use client";

import { HStack } from "@navikt/ds-react";
import { useParams } from "next/navigation";
import { useRef } from "react";
import { knappKlikket } from "@/common/analytics/events-and-properties/knappKlikket-properties";
import { TrackedButton } from "@/ui/TrackedButton";
import { LagNyPlanModal } from "../LagNyPlanModal";
import { VisPdfButtonAG } from "./VisPdfButtonAG";

interface Props {
  planId: string;
  hasUtkast: boolean;
}

export function AktivPlanButtons({ planId, hasUtkast }: Props) {
  const { narmesteLederId } = useParams<{ narmesteLederId: string }>();
  const lagNyPlanModalRef = useRef<HTMLDialogElement | null>(null);

  return (
    <>
      <LagNyPlanModal ref={lagNyPlanModalRef} hasUtkast={hasUtkast} />
      <HStack justify="space-between">
        <TrackedButton
          variant="primary"
          onClick={() => lagNyPlanModalRef.current?.showModal()}
          tracking={knappKlikket.aktivPlanSide.lagNyOppfolgingsplanModalTrigger}
        >
          Lag ny oppfølgingsplan
        </TrackedButton>

        <VisPdfButtonAG narmesteLederId={narmesteLederId} planId={planId} />
      </HStack>
    </>
  );
}
