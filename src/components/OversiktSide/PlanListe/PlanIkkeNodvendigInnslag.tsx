import { BodyShort, Box, Heading, HStack, Tag, VStack } from "@navikt/ds-react";
import type { UnntaksvurderingMetadata } from "@/schema/unntaksvurderingSchemas";
import { getFormattedDateString } from "@/ui-helpers/dateAndTime";

interface Props {
  unntak: UnntaksvurderingMetadata;
  visOrganisasjon?: boolean;
}

export default function PlanIkkeNodvendigInnslag({
  unntak,
  visOrganisasjon = false,
}: Props) {
  const { meldtTidspunkt, meldtAv, organization } = unntak;
  const organisasjon =
    organization.orgName ?? `Org.nr. ${organization.orgNumber}`;

  return (
    <Box
      as="article"
      background="neutral-soft"
      borderRadius="12"
      padding="space-20"
    >
      <VStack gap="space-12">
        <VStack gap="space-4">
          <Heading level="4" size="xsmall">
            Ikke aktuelt med oppfølgingsplan nå
          </Heading>

          <BodyShort size="small">
            Registrert {getFormattedDateString(meldtTidspunkt)}
          </BodyShort>

          {visOrganisasjon && (
            <BodyShort size="small">Virksomhet: {organisasjon}</BodyShort>
          )}

          {meldtAv.navn && (
            <BodyShort size="small">
              Av {meldtAv.navn} ({meldtAv.rolle.toLowerCase()})
            </BodyShort>
          )}
        </VStack>

        <HStack>
          <Tag variant="moderate" data-color="neutral" size="small">
            Ikke aktuelt
          </Tag>
        </HStack>
      </VStack>
    </Box>
  );
}
