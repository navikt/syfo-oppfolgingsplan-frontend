"use client";

import NextLink from "next/link";
import { ChevronLeftIcon } from "@navikt/aksel-icons";
import { knappKlikket } from "@/common/analytics/events-and-properties/knappKlikket-properties";
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
      tracking={knappKlikket.ferdigstiltPlanSide.tilbakeTilOversikt}
    >
      Tilbake til oppfølgingsplaner
    </TrackedButton>
  );
}
