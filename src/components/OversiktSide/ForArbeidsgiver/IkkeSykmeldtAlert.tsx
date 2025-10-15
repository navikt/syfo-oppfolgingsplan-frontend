import { Alert, BodyLong, Box, Heading } from "@navikt/ds-react";

export default function KanIkkeLageOppfolgingsplanForAnsattAlert({
  className,
}: {
  className?: string;
}) {
  return (
    <Alert variant="info" size="small" className={className}>
      <Heading level="3" size="small" spacing>
        Den ansatte er ikke sykmeldt
      </Heading>
      <Box>
        <BodyLong>
          Du kan ikke lage en oppfølgingsplan for den ansatte nå. Du kan kun
          opprette nye oppfølgingsplaner når den ansatte har en sykmelding,
          eller det er mindre enn 16 dager siden siste sykmeldingsdato.
        </BodyLong>
      </Box>
    </Alert>
  );
}
