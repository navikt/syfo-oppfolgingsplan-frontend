"use client";

import NextLink from "next/link";
import { Box, Button } from "@navikt/ds-react";
import { getAGOpprettNyPlanHref } from "@/constants/route-hrefs";

export function LagNyOppfolgingsplanButton({
  narmesteLederId,
}: {
  narmesteLederId: string;
}) {
  return (
    <Box className="mb-12">
      <Button
        variant="primary"
        as={NextLink}
        href={getAGOpprettNyPlanHref(narmesteLederId)}
      >
        Lag en ny oppfølgingsplan
      </Button>
    </Box>
  );
}
