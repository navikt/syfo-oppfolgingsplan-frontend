import NextLink from "next/link";
import { BodyShort, LinkCard } from "@navikt/ds-react";
import {
  LinkCardAnchor,
  LinkCardDescription,
  LinkCardFooter,
  LinkCardTitle,
} from "@navikt/ds-react/LinkCard";
import { FerdigstiltPlanMetadata } from "@/schema/ferdigstiltPlanMetadataSchema";
import { getLocaleDateString } from "@/ui-helpers/dateAndTime";

interface Props {
  href: string;
  planMetadata: FerdigstiltPlanMetadata;
  arbeidsstedNavn: string;
  footerContent?: React.ReactNode;
  className?: string;
}

export default function PlanLinkCard({
  href,
  planMetadata: { ferdigstiltTidspunkt, evalueringsDato },
  arbeidsstedNavn,
  footerContent,
  className,
}: Props) {
  return (
    <LinkCard className={className}>
      <LinkCardTitle>
        <LinkCardAnchor asChild>
          <NextLink href={href}>{arbeidsstedNavn}</NextLink>
        </LinkCardAnchor>
      </LinkCardTitle>

      <LinkCardDescription>
        <BodyShort size="small">
          Opprettet dato: {getLocaleDateString(ferdigstiltTidspunkt, "long")}
        </BodyShort>
        {evalueringsDato && (
          <BodyShort size="small">
            Evalueringsdato: {getLocaleDateString(evalueringsDato, "long")}
          </BodyShort>
        )}
      </LinkCardDescription>

      {footerContent && <LinkCardFooter>{footerContent}</LinkCardFooter>}
    </LinkCard>
  );
}
