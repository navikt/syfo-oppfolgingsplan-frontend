import { Alert, BodyLong, Box, Heading } from "@navikt/ds-react";

export default function IkkeSykmeldtAlert({
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
        {/* <Box className="max-w-[620]"> */}
        <BodyLong>
          Du kan ikke opprette en oppfølgingsplan for den ansatte nå. Du kan kun
          opprette nye oppfølgingsplaner når den ansatte har en sykmelding,
          eller det er mindre enn 16 dager siden siste sykmeldingsdato.
        </BodyLong>
      </Box>
    </Alert>
  );
}
