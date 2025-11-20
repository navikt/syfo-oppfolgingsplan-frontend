import NextLink from "next/link";
import { BodyShort, LinkCard } from "@navikt/ds-react";
import {
  LinkCardAnchor,
  LinkCardDescription,
  LinkCardFooter,
  LinkCardTitle,
} from "@navikt/ds-react/LinkCard";
import { FerdigstiltPlanMetadata } from "@/schema/ferdigstiltPlanMetadataSchema";
import {
  getLocaleDateAndTimeString,
  getLocaleDateString,
} from "@/ui-helpers/dateAndTime";
import PlanDelingStatusTags from "./PlanLinkCardFooterTags";

interface Props {
  aktivPlan: FerdigstiltPlanMetadata;
  linkCardTitle: string;
  href: string;
}

export default function AktivPlanLinkCard({
  aktivPlan: {
    ferdigstiltTidspunkt,
    evalueringsDato,
    deltMedLegeTidspunkt,
    deltMedVeilederTidspunkt,
  },
  linkCardTitle,
  href,
}: Props) {
  return (
    <LinkCard className="bg-ax-bg-success-soft">
      <LinkCardTitle>
        <LinkCardAnchor asChild>
          <NextLink href={href}>{linkCardTitle}</NextLink>
        </LinkCardAnchor>
      </LinkCardTitle>

      <LinkCardDescription>
        <BodyShort size="small" className="mb-1">
          Ferdigstilt {getLocaleDateAndTimeString(ferdigstiltTidspunkt, "long")}
          .
        </BodyShort>

        <BodyShort size="small">
          Evaluering av planen planlagt{" "}
          {getLocaleDateString(evalueringsDato, "long")}.
        </BodyShort>
      </LinkCardDescription>

      <LinkCardFooter>
        <PlanDelingStatusTags
          tagSize="small"
          isDeltMedLege={deltMedLegeTidspunkt !== null}
          isDeltMedVeileder={deltMedVeilederTidspunkt !== null}
          tagVariantHvisDelt="success-moderate"
          tagVariantHvisIkkeDelt="neutral-moderate"
        />
      </LinkCardFooter>
    </LinkCard>
  );
}
