"use client";

import NextLink from "next/link";
import { Button, HStack } from "@navikt/ds-react";
import { getAGOpprettNyPlanHref } from "@/common/route-hrefs";
import { LastNedSomPdfButtonForAG } from "../LastNedSomPdfButtonForAG";

interface Props {
  narmesteLederId: string;
}

export function AktivPlanButtons({ narmesteLederId }: Props) {
  return (
    <HStack justify="space-between">
      <HStack gap="4">
        <Button
          variant="primary"
          as={NextLink}
          href={getAGOpprettNyPlanHref(narmesteLederId)}
        >
          Endre oppfølgingsplanen
        </Button>

        <Button variant="secondary">Lag en ny plan</Button>
      </HStack>

      <LastNedSomPdfButtonForAG />
    </HStack>
  );
}
