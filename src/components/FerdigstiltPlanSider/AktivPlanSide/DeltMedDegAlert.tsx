import { Alert, BodyLong, Heading, Link } from "@navikt/ds-react";

interface DeltMedDegAlertProps {
  isDeltMedVeileder: boolean;
}

function PlanDeltMedVeilederInfoTekst() {
  return (
    <>
      {" "}
      Hvis det ikke er mulig, tar du kontakt med Nav (
      <Link href="https://www.nav.no/kontaktoss">lenke</Link>) slik at du kan gi
      tilleggsopplysninger du mener er viktig.
    </>
  );
}

export function DeltMedDegAlert({ isDeltMedVeileder }: DeltMedDegAlertProps) {
  const infoTekstHvisDeltMedVeileder = isDeltMedVeileder ? (
    <PlanDeltMedVeilederInfoTekst />
  ) : null;

  return (
    <Alert variant="info">
      <Heading level="3" size="small" spacing>
        Arbeidsgiveren din har delt oppfølgingsplanen med deg
      </Heading>
      <BodyLong>
        Er det noe i denne planen du er uenig i, må du snakke med lederen din
        for å lage en ny oppfølgingsplan.
        {infoTekstHvisDeltMedVeileder}
      </BodyLong>
    </Alert>
  );
}
