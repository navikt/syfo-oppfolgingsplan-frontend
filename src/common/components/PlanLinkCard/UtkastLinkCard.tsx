import NextLink from "next/link";
import { BodyShort, LinkCard, Tag } from "@navikt/ds-react";
import {
  LinkCardAnchor,
  LinkCardDescription,
  LinkCardFooter,
  LinkCardTitle,
} from "@navikt/ds-react/LinkCard";
import { getLocaleDateAndTimeString } from "@/common/dateAndTime";
import { getAGOpprettNyPlanHref } from "@/common/route-hrefs";
import { UtkastMetadata } from "@/schema/utkastMetadataSchema";

interface Props {
  utkast: UtkastMetadata;
  arbeidsstedNavn: string;
  narmesteLederId: string;
}

export default function UtkastLinkPanel({
  utkast: { sistLagretTidspunkt },
  arbeidsstedNavn,
  narmesteLederId,
}: Props) {
  const utkastSistLagretTidspunkt = getLocaleDateAndTimeString(
    sistLagretTidspunkt,
    "long",
  );

  return (
    <LinkCard className="bg-ax-bg-brand-beige-soft">
      <LinkCardTitle>
        <LinkCardAnchor asChild>
          <NextLink href={getAGOpprettNyPlanHref(narmesteLederId)}>
            {arbeidsstedNavn}
          </NextLink>
        </LinkCardAnchor>
      </LinkCardTitle>

      <LinkCardDescription>
        <BodyShort size="small" spacing>
          <em>Sist lagret {utkastSistLagretTidspunkt}</em>
        </BodyShort>
      </LinkCardDescription>

      <LinkCardFooter>
        <Tag variant="neutral-moderate" size="small">
          Kun synlig for deg
        </Tag>
      </LinkCardFooter>
    </LinkCard>
  );
}
