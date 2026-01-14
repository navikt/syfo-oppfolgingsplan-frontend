import { Alert, BodyShort, Box, Heading } from "@navikt/ds-react";
import { fetchOppfolgingsplanOversiktForAG } from "@/server/fetchData/arbeidsgiver/fetchOppfolgingsplanOversikt.ts";

export async function AnsattIkkeSykmeldtAlert({
  narmesteLederId,
}: {
  narmesteLederId: string;
}) {
  const oversiktResult =
    await fetchOppfolgingsplanOversiktForAG(narmesteLederId);

  if (oversiktResult.error) return null;

  const { userHasEditAccess } = oversiktResult.data;

  return (
    !userHasEditAccess && (
      <Box>
        <Alert variant="info" size="small" className="mb-12">
          <Heading level="3" size="small" spacing>
            Den ansatte er ikke sykmeldt
          </Heading>
          <Box>
            <BodyShort>
              Du kan ikke opprette en oppfølgingsplan for den ansatte nå. Du kan
              kun opprette nye oppfølgingsplaner når den ansatte har en
              sykmelding, eller det er mindre enn 16 dager siden siste
              sykmeldingsdato.
            </BodyShort>
          </Box>
        </Alert>
      </Box>
    )
  );
}
