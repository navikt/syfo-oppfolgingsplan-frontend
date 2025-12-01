import { Alert, BodyLong, Heading, Link } from "@navikt/ds-react";

export function DeltMedDegAlert() {
  return (
    <Alert variant="info">
      <Heading level="3" size="small" spacing>
        Arbeidsgiveren din har delt oppfølgingsplanen med deg
      </Heading>
      <BodyLong>
        Er det noe i denne planen du er uenig i, må du snakke med lederen din
        for å lage en ny oppfølgingsplan. Hvis det ikke er mulig, tar du kontakt
        med Nav (<Link href="https://www.nav.no/kontaktoss">lenke</Link>) slik
        at du kan gi tilleggsopplysninger du mener er viktig.
      </BodyLong>
    </Alert>
  );
}
