"use client";

import { HStack } from "@navikt/ds-react";
import NextLink from "next/link";
import { knappKlikket } from "@/common/analytics/events-and-properties/knappKlikket-properties";
import { getAGOpprettNyPlanHref } from "@/common/route-hrefs";
import { TrackedButton } from "@/ui/TrackedButton";

export function LagNyOppfolgingsplanButton({
  narmesteLederId,
}: {
  narmesteLederId: string;
}) {
  return (
    <HStack>
      <TrackedButton
        variant="primary"
        as={NextLink}
        href={getAGOpprettNyPlanHref(narmesteLederId)}
        tracking={knappKlikket.oversiktSide.lagNyOppfolgingsplan}
      >
        Lag en ny oppfølgingsplan
      </TrackedButton>
    </HStack>
  );
}
