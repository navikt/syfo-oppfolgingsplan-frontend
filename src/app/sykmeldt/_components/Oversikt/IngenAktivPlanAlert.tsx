import { Alert, BodyLong, Heading } from "@navikt/ds-react";

export function IngenAktivPlanAlert() {
  return (
    <Alert variant="info" className="mb-8">
      <Heading level="3" size="small" spacing>
        Du har ikke en aktiv oppfølgingsplan
      </Heading>
      <BodyLong>
        Du kan når som helst be arbeidsgiveren din om å lage en plan.
      </BodyLong>
    </Alert>
  );
}
