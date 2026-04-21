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

export function IkkeMedvirketInfoCard({ isDeltMedVeileder }: Props) {
  return (
    <InfoCard data-color="warning">
      <InfoCardHeader icon={<InformationSquareIcon aria-hidden />}>
        <InfoCardTitle as="h3">
          Lederen din skriver at planen er laget uten deg
        </InfoCardTitle>
      </InfoCardHeader>

      <InfoCardContent>
        <BodyLong>
          Du kan lese begrunnelsen til lederen din i planen nedenfor. Hvis du er
          uenig i innholdet må du ta kontakt med lederen din for å lage en ny
          plan.
        </BodyLong>
        {isDeltMedVeileder && (
          <BodyLong className="mt-7">
            Lederen din har sendt oppfølgingsplanen til Nav-veilederen din. Får
            du ikke laget en ny plan med lederen din, kan du ta{" "}
            <Link href="https://www.nav.no/kontaktoss">kontakt med Nav</Link>{" "}
            for å gi tilleggsopplysninger du mener er viktig.
          </BodyLong>
        )}
      </InfoCardContent>
    </InfoCard>
  );
}
