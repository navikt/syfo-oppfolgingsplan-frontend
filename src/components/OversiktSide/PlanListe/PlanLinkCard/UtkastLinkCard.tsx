"use client";

import { BodyShort, LinkCard, Tag } from "@navikt/ds-react";
import {
  LinkCardAnchor,
  LinkCardDescription,
  LinkCardFooter,
  LinkCardTitle,
} from "@navikt/ds-react/LinkCard";
import NextLink from "next/link";
import { logAnalyticsEvent } from "@/common/analytics/logAnalyticsEvent";
import { getAGOpprettNyPlanHref } from "@/common/route-hrefs";
import type { UtkastMetadata } from "@/schema/utkastMetadataSchema";
import {
  getFormattedDateAndTimeString,
  getFormattedTimeString,
} from "@/ui-helpers/dateAndTime";
import { isDateToday } from "@/utils/dateAndTime/dateUtils";

interface Props {
  utkast: UtkastMetadata;
  linkCardTitle: string;
  narmesteLederId: string;
}

export default function UtkastLinkPanel({
  utkast: { sistLagretTidspunkt },
  linkCardTitle,
  narmesteLederId,
}: Props) {
  const isToday = isDateToday(sistLagretTidspunkt);

  const utkastSistLagretFormatted = isToday
    ? `i dag kl. ${getFormattedTimeString(sistLagretTidspunkt)}`
    : getFormattedDateAndTimeString(sistLagretTidspunkt);

  function logAnalyticsLinkCardClick() {
    logAnalyticsEvent({
      name: "linkcard klikket",
      properties: {
        tittel: "Oppfølgingsplan under arbeid",
        destinasjon: getAGOpprettNyPlanHref(narmesteLederId),
        seksjon: "Oppfølgingsplan under arbeid",
      },
    });
  }

  return (
    <LinkCard className="bg-ax-bg-brand-beige-soft">
      <LinkCardTitle>
        <LinkCardAnchor asChild>
          <NextLink
            href={getAGOpprettNyPlanHref(narmesteLederId)}
            onClick={logAnalyticsLinkCardClick}
          >
            {linkCardTitle}
          </NextLink>
        </LinkCardAnchor>
      </LinkCardTitle>
      <LinkCardDescription>
        <BodyShort size="small">
          <em>Sist lagret {utkastSistLagretFormatted}.</em>
        </BodyShort>
      </LinkCardDescription>
      <LinkCardFooter>
        <Tag data-color="neutral" variant="moderate" size="small">
          Kun synlig for deg
        </Tag>
      </LinkCardFooter>
    </LinkCard>
  );
}
