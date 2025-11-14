import NextLink from "next/link";
import { BodyShort, LinkCard } from "@navikt/ds-react";
import {
  LinkCardAnchor,
  LinkCardDescription,
  LinkCardFooter,
  LinkCardTitle,
} from "@navikt/ds-react/LinkCard";
import { OppfolgingsplanMetadata } from "@/schema/oversiktResponseSchemas";
import { getDatoString } from "@/ui-helpers/dateAndTime";

interface Props {
  href: string;
  planMetadata: OppfolgingsplanMetadata;
  arbeidsstedNavn: string;
  footerContent?: React.ReactNode;
  className?: string;
}

export default function PlanLinkCard({
  href,
  planMetadata,
  arbeidsstedNavn,
  footerContent,
  className,
}: Props) {
  const opprettetDato = new Date(planMetadata.createdAt);
  const evalueringsDato = new Date(planMetadata.evalueringsdato);

  return (
    <LinkCard className={className}>
      <LinkCardTitle>
        <LinkCardAnchor asChild>
          <NextLink href={href}>{arbeidsstedNavn}</NextLink>
        </LinkCardAnchor>
      </LinkCardTitle>

      <LinkCardDescription>
        <BodyShort size="small">
          Opprettet dato: {getDatoString(opprettetDato)}
        </BodyShort>
        {evalueringsDato && (
          <BodyShort size="small">
            Evalueringsdato: {getDatoString(evalueringsDato)}
          </BodyShort>
        )}
      </LinkCardDescription>

      {footerContent && <LinkCardFooter>{footerContent}</LinkCardFooter>}
    </LinkCard>
  );
}
