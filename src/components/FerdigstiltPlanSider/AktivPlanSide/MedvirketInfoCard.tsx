import { InformationSquareIcon } from "@navikt/aksel-icons";
import { BodyLong, Link } from "@navikt/ds-react";
import {
  InfoCard,
  InfoCardContent,
  InfoCardHeader,
  InfoCardTitle,
} from "@navikt/ds-react/InfoCard";

interface Props {
  isDeltMedVeileder: boolean;
}

export function MedvirketInfoCard({ isDeltMedVeileder }: Props) {
  return (
    <InfoCard data-color="info">
      <InfoCardHeader icon={<InformationSquareIcon aria-hidden />}>
        <InfoCardTitle as="h3">
          Lederen din har delt oppfølgingsplanen med deg
        </InfoCardTitle>
      </InfoCardHeader>

      <InfoCardContent>
        <BodyLong>
          Er det noe i denne planen du er uenig i, må du snakke med lederen din
          for å lage en ny oppfølgingsplan.
        </BodyLong>
        {isDeltMedVeileder && (
          <BodyLong className="mt-7">
            Lederen din har sendt oppfølgingsplanen til Nav-veilederen din. Får
            du ikke laget en ny plan med lederen din, kan du ta{" "}
            <Link href="https://www.nav.no/kontaktoss">kontakt med Nav</Link>{" "}
            for å å gi tilleggsopplysninger du mener er viktig.
          </BodyLong>
        )}
      </InfoCardContent>
    </InfoCard>
  );
}
