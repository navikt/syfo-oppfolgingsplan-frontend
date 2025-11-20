import NextLink from "next/link";
import { BodyShort, LinkCard, Tag } from "@navikt/ds-react";
import {
  LinkCardAnchor,
  LinkCardDescription,
  LinkCardFooter,
  LinkCardTitle,
} from "@navikt/ds-react/LinkCard";
import { getAGOpprettNyPlanHref } from "@/common/route-hrefs";
import { UtkastMetadata } from "@/schema/utkastMetadataSchema";
import { getLocaleDateAndTimeString } from "@/ui-helpers/dateAndTime";

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
  const utkastSistLagretTidspunkt = getLocaleDateAndTimeString(
    sistLagretTidspunkt,
    "long",
  );

  return (
    <LinkCard className="bg-ax-bg-brand-beige-soft">
      <LinkCardTitle>
        <LinkCardAnchor asChild>
          <NextLink href={getAGOpprettNyPlanHref(narmesteLederId)}>
            {linkCardTitle}
          </NextLink>
        </LinkCardAnchor>
      </LinkCardTitle>

      <LinkCardDescription>
        <BodyShort size="small">
          <em>Sist lagret {utkastSistLagretTidspunkt}.</em>
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
