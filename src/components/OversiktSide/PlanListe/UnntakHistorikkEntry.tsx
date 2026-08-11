import { BodyShort, Box, Heading, HStack, Tag, VStack } from "@navikt/ds-react";
import type { UnntaksvurderingMetadata } from "@/schema/unntaksvurderingSchemas";
import { getFormattedDateString } from "@/ui-helpers/dateAndTime";

interface Props {
  unntak: UnntaksvurderingMetadata;
}

/**
 * Historikk-innslag for en meldt unntaksvurdering, etter Figma-skissen
 * «Unntak vist i historikk». Ikke klikkbar — et unntak har ingen detaljside,
 * kun hvem og når.
 */
export default function UnntakHistorikkEntry({ unntak }: Props) {
  const { meldtTidspunkt, meldtAv } = unntak;

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
