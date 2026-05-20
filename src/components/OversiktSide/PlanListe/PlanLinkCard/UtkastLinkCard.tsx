"use client";

import {
  BodyShort,
  InlineMessage,
  LinkCard,
  Tag,
  VStack,
} from "@navikt/ds-react";
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
  getFormattedDateString,
  getFormattedTimeString,
} from "@/ui-helpers/dateAndTime";
import { isDateToday } from "@/utils/dateAndTime/dateUtils";

interface Props {
  utkast: UtkastMetadata;
  linkCardTitle: string;
  narmesteLederId: string;
}

export default function UtkastLinkPanel({
  utkast: { sistLagretTidspunkt, utkastUtloperDato },
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
        <VStack gap="space-8">
          <BodyShort size="small">
            <em>Sist lagret {utkastSistLagretFormatted}.</em>
          </BodyShort>
          <InlineMessage status="warning" size="small">
            {utkastUtloperDato
              ? `Utkastet slettes ${getFormattedDateString(utkastUtloperDato)} hvis dere ikke gjør endringer innen da.`
              : "Utkastet slettes automatisk 4 måneder etter siste lagring."}
          </InlineMessage>
        </VStack>
      </LinkCardDescription>
      <LinkCardFooter>
        <Tag data-color="neutral" variant="moderate" size="small">
          Kun synlig for deg
        </Tag>
      </LinkCardFooter>
    </LinkCard>
  );
}
