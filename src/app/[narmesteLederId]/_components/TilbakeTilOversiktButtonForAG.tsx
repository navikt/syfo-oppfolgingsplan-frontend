"use client";

import NextLink from "next/link";
import { useParams } from "next/navigation";
import { ChevronLeftIcon } from "@navikt/aksel-icons";
import { Button } from "@navikt/ds-react";
import { getAGOversiktHref } from "@/common/route-hrefs";

export default function TilbakeTilOversiktButtonForAG() {
  const { narmesteLederId } = useParams<{ narmesteLederId: string }>();

  return (
    <Button
      variant="tertiary"
      as={NextLink}
      iconPosition="left"
      icon={<ChevronLeftIcon aria-hidden />}
      href={getAGOversiktHref(narmesteLederId)}
      className="self-start"
    >
      Tilbake til oppfølgingsplaner
    </Button>
  );
}
