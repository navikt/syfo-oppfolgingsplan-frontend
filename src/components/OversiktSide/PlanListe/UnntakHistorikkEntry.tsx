import { BodyShort, Heading, Tag } from "@navikt/ds-react";
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
    <div className="rounded-xl bg-ax-bg-neutral-soft p-5">
      <Heading level="4" size="xsmall" spacing>
        Ikke aktuelt med oppfølgingsplan nå
      </Heading>

      <BodyShort size="small" className="mb-1">
        Registrert {getFormattedDateString(meldtTidspunkt)}
      </BodyShort>

      {meldtAv.navn && (
        <BodyShort size="small" className="mb-1">
          Av {meldtAv.navn} ({meldtAv.rolle.toLowerCase()})
        </BodyShort>
      )}

      <Tag variant="neutral-moderate" size="small" className="mt-2">
        Ikke aktuelt
      </Tag>
    </div>
  );
}
