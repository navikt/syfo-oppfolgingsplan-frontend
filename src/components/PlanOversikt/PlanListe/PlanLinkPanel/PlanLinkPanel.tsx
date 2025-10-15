import { BodyShort, LinkCard } from "@navikt/ds-react";
import NextLink from "next/link";
import {
  LinkCardAnchor,
  LinkCardDescription,
  LinkCardFooter,
  LinkCardTitle,
} from "@navikt/ds-react/LinkCard";
import { getDatoString } from "@/ui-helpers/dateAndTime";
import PlanLinkPanelTags from "./PlanLinkPanelTags";

interface Props {
  arbeidsplassNavn: string;
  href: string;
  opprettetDato: Date;
  evalueringsDato: Date | null;
  isDeltMedLege: boolean;
  isDeltMedNav: boolean;
  lastUpdated?: Date;
  isForPreviousPlan?: boolean;
  className?: string;
}

export default function PlanLinkPanel({
  arbeidsplassNavn,
  href,
  opprettetDato,
  evalueringsDato,
  isDeltMedLege,
  isDeltMedNav,
  isForPreviousPlan = false,
  className,
}: Props) {
  return (
    <LinkCard className={className}>
      <LinkCardTitle>
        <LinkCardAnchor asChild>
          <NextLink href={href}>{arbeidsplassNavn}</NextLink>
          {/* <NextLink href={href}>{getPlanDatoHeading(opprettetDato)}</NextLink> */}
        </LinkCardAnchor>
      </LinkCardTitle>

      <LinkCardDescription>
        <BodyShort size="small">
          Opprettet dato: {getDatoString(opprettetDato)}
        </BodyShort>
        <BodyShort size="small">
          {evalueringsDato && (
            <>Evalueringsdato: {getDatoString(evalueringsDato)}</>
          )}
        </BodyShort>
      </LinkCardDescription>

      <LinkCardFooter>
        <PlanLinkPanelTags
          isDeltMedLege={isDeltMedLege}
          isDeltMedNav={isDeltMedNav}
          notSharedTagVariant={isForPreviousPlan ? "info-moderate" : undefined}
        />
      </LinkCardFooter>
    </LinkCard>
  );
}
