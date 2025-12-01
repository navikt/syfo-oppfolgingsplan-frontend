"use client";

import NextLink from "next/link";
import { ChevronLeftIcon } from "@navikt/aksel-icons";
import { Button } from "@navikt/ds-react";
import { getSMOversiktHref } from "@/common/route-hrefs";

export default function TilbakeTilOversiktButtonForSM() {
  return (
    <Button
      variant="tertiary"
      as={NextLink}
      iconPosition="left"
      icon={<ChevronLeftIcon aria-hidden />}
      href={getSMOversiktHref()}
      className="self-start mb-8"
    >
      Tilbake til oppfølgingsplaner
    </Button>
  );
}
