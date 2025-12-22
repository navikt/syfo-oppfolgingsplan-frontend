"use client";

import NextLink from "next/link";
import { Box } from "@navikt/ds-react";
import { getAGOpprettNyPlanHref } from "@/common/route-hrefs";
import { TrackedButton } from "@/ui/TrackedButton";

export function LagNyOppfolgingsplanButton({
  narmesteLederId,
}: {
  narmesteLederId: string;
}) {
  return (
    <Box className="mb-12">
      <TrackedButton
        variant="primary"
        as={NextLink}
        href={getAGOpprettNyPlanHref(narmesteLederId)}
        tracking={{
          komponentId: "lag-ny-oppfolgingsplan-knapp",
          tekst: "Lag en ny oppfølgingsplan",
          kontekst: "OversiktSide",
        }}
      >
        Lag en ny oppfølgingsplan
      </TrackedButton>
    </Box>
  );
}
