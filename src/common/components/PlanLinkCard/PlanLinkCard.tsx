import NextLink from "next/link";
import { BodyShort, LinkCard } from "@navikt/ds-react";
import {
  LinkCardAnchor,
  LinkCardDescription,
  LinkCardFooter,
  LinkCardTitle,
} from "@navikt/ds-react/LinkCard";
import { getLocaleDateString } from "@/common/dateAndTime";
import { FerdigstiltPlanMetadata } from "@/schema/ferdigstiltPlanMetadataSchema";

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
          Opprettet:{" "}
          <strong>{getLocaleDateString(ferdigstiltTidspunkt, "long")}</strong>
        </BodyShort>
        {evalueringsDato && (
          <BodyShort size="small">
            Evalueringsdato:{" "}
            <strong>{getLocaleDateString(evalueringsDato, "long")}</strong>
          </BodyShort>
        )}
      </LinkCardDescription>

      {footerContent && <LinkCardFooter>{footerContent}</LinkCardFooter>}
    </LinkCard>
  );
}
