import { InformationSquareIcon } from "@navikt/aksel-icons";
import { BodyLong, Link, VStack } from "@navikt/ds-react";
import {
  InfoCard,
  InfoCardContent,
  InfoCardHeader,
  InfoCardTitle,
} from "@navikt/ds-react/InfoCard";
import type { UnntaksvurderingMetadata } from "@/schema/unntaksvurderingSchemas";

interface Props {
  unntaksvurdering: UnntaksvurderingMetadata;
}

export function UnntaksvurderingInfoCard({ unntaksvurdering }: Props) {
  const organizationReference = unntaksvurdering.organization.orgName
    ? `i ${unntaksvurdering.organization.orgName}`
    : `hos arbeidsgiveren med org.nr. ${unntaksvurdering.organization.orgNumber}`;

  return (
    <article>
      <InfoCard data-color="danger">
        <InfoCardHeader icon={<InformationSquareIcon aria-hidden />}>
          <InfoCardTitle as="h3">
            Nav har fått melding om at det ikke er behov for oppfølgingsplan
          </InfoCardTitle>
        </InfoCardHeader>
        <InfoCardContent>
          <VStack gap="space-16">
            <BodyLong>
              Lederen din {organizationReference} har meldt fra om at det ikke
              er behov for å lage en plan på nåværende tidspunkt i sykefraværet.
              Dersom det ikke stemmer, anbefaler vi at du tar kontakt med
              lederen din.
            </BodyLong>
            <BodyLong>
              Er det vanskelig å snakke med lederen din, kan du ta kontakt med
              Nav ved å{" "}
              <Link href="https://www.nav.no/kontaktoss">skrive til oss</Link>{" "}
              eller på telefon 55 55 33 33.
            </BodyLong>
          </VStack>
        </InfoCardContent>
      </InfoCard>
    </article>
  );
}
