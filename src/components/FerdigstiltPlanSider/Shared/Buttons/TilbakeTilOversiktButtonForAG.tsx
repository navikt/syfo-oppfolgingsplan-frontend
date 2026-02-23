"use client";

import { ChevronLeftIcon } from "@navikt/aksel-icons";
import NextLink from "next/link";
import { useParams } from "next/navigation";
import { knappKlikket } from "@/common/analytics/events-and-properties/knappKlikket-properties";
import { getAGOversiktHref } from "@/common/route-hrefs";
import { TrackedButton } from "@/ui/TrackedButton";

export default function TilbakeTilOversiktButtonForAG() {
  const { narmesteLederId } = useParams<{ narmesteLederId: string }>();

  return (
    <TrackedButton
      variant="tertiary"
      as={NextLink}
      iconPosition="left"
      icon={<ChevronLeftIcon aria-hidden />}
      href={getAGOversiktHref(narmesteLederId)}
      className="self-start"
      tracking={knappKlikket.ferdigstiltPlanSide.tilbakeTilOversikt}
    >
      Tilbake til oppfølgingsplaner
    </TrackedButton>
  );
}
