"use client";

import NextLink from "next/link";
import { ChevronLeftIcon } from "@navikt/aksel-icons";
import { getSMOversiktHref } from "@/common/route-hrefs";
import { TrackedButton } from "@/ui/TrackedButton";

export default function TilbakeTilOversiktButtonForSM() {
  return (
    <TrackedButton
      variant="tertiary"
      as={NextLink}
      iconPosition="left"
      icon={<ChevronLeftIcon aria-hidden />}
      href={getSMOversiktHref()}
      className="self-start mb-8"
      tracking={{
        komponentId: "tilbake-til-oversikt-knapp",
        tekst: "Tilbake til oppfølgingsplaner",
        kontekst: "FerdigstiltPlanSide",
      }}
    >
      Tilbake til oppfølgingsplaner
    </TrackedButton>
  );
}
