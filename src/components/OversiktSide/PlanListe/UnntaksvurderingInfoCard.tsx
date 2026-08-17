import { InformationSquareIcon } from "@navikt/aksel-icons";
import { BodyLong, Link } from "@navikt/ds-react";
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
      <InfoCard data-color="neutral">
        <InfoCardHeader icon={<InformationSquareIcon aria-hidden />}>
          <InfoCardTitle as="h3">
            Oppfølgingsplan er foreløpig ikke aktuell
          </InfoCardTitle>
        </InfoCardHeader>
        <InfoCardContent>
          <BodyLong>
            Lederen din {organizationReference} har vurdert at en
            oppfølgingsplan ikke er nødvendig nå. Ta{" "}
            <Link href="https://www.nav.no/kontaktoss">kontakt med Nav</Link>{" "}
            hvis du har spørsmål.
          </BodyLong>
        </InfoCardContent>
      </InfoCard>
    </article>
  );
}
