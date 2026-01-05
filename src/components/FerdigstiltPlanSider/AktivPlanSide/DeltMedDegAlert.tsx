import { Alert, BodyLong, Heading, Link } from "@navikt/ds-react";

interface Props {
  isDeltMedVeileder: boolean;
}

export function DeltMedDegAlert({ isDeltMedVeileder }: Props) {
  const planDeltMedVeilederInfoTekst = (
    <span>
      Hvis det ikke er mulig, tar du kontakt med Nav (
      <Link href="https://www.nav.no/kontaktoss">lenke</Link>) slik at du kan gi
      tilleggsopplysninger du mener er viktig.
    </span>
  );

  return (
    <Alert variant="info">
      <Heading level="3" size="small" spacing>
        Arbeidsgiveren din har delt oppfølgingsplanen med deg
      </Heading>
      <BodyLong>
        Er det noe i denne planen du er uenig i, må du snakke med lederen din
        for å lage en ny oppfølgingsplan.{" "}
        {isDeltMedVeileder && planDeltMedVeilederInfoTekst}
      </BodyLong>
    </Alert>
  );
}
