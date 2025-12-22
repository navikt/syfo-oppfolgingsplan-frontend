"use client";

import NextLink from "next/link";
import { BodyShort, LinkCard } from "@navikt/ds-react";
import {
  LinkCardAnchor,
  LinkCardDescription,
  LinkCardFooter,
  LinkCardTitle,
} from "@navikt/ds-react/LinkCard";
import { logTaxonomyEvent } from "@/common/logTaxonomyEvent";
import { FerdigstiltPlanMetadata } from "@/schema/ferdigstiltPlanMetadataSchema";
import { getFormattedDateString } from "@/ui-helpers/dateAndTime";
import PlanDelingStatusTags from "./PlanLinkCardFooterTags";

interface Props {
  tidligerePlan: FerdigstiltPlanMetadata;
  linkCardTitle: string;
  href: string;
}

export default function TidligerePlanLinkCard({
  tidligerePlan: {
    ferdigstiltTidspunkt,
    evalueringsDato,
    deltMedLegeTidspunkt,
    deltMedVeilederTidspunkt,
  },
  linkCardTitle,
  href,
}: Props) {
  return (
    <LinkCard className="bg-ax-bg-neutral-soft">
      <LinkCardTitle>
        <LinkCardAnchor asChild>
          <NextLink
            href={href}
            onClick={() => {
              logTaxonomyEvent({
                name: "linkcard klikket",
                properties: {
                  tittel: "Tidligere plan",
                  destinasjon: href,
                  seksjon: "Tidligere oppfølgingsplaner",
                },
              });
            }}
          >
            {linkCardTitle}
          </NextLink>
        </LinkCardAnchor>
      </LinkCardTitle>

      <LinkCardDescription>
        <BodyShort size="small" className="mb-1">
          Opprettet dato: {getFormattedDateString(ferdigstiltTidspunkt)}
        </BodyShort>

        <BodyShort size="small">
          Evalueringsdato: {getFormattedDateString(evalueringsDato)}
        </BodyShort>
      </LinkCardDescription>

      <LinkCardFooter>
        <PlanDelingStatusTags
          tagSize="small"
          isDeltMedLege={deltMedLegeTidspunkt !== null}
          isDeltMedVeileder={deltMedVeilederTidspunkt !== null}
          tagVariantHvisDelt="success-moderate"
          tagVariantHvisIkkeDelt="info-moderate"
        />
      </LinkCardFooter>
    </LinkCard>
  );
}
