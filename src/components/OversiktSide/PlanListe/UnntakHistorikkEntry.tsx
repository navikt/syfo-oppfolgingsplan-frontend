import { BodyShort, Heading } from "@navikt/ds-react";
import type { UnntaksvurderingMetadata } from "@/schema/unntaksvurderingSchemas";
import { getFormattedDateString } from "@/ui-helpers/dateAndTime";

interface Props {
  unntak: UnntaksvurderingMetadata;
}

/**
 * Historikk-innslag for en meldt unntaksvurdering («oppfølgingsplan er ikke
 * aktuell nå»). Ikke klikkbar — et unntak har ingen detaljside, kun hvem og når.
 */
export default function UnntakHistorikkEntry({ unntak }: Props) {
  const { meldtTidspunkt, meldtAv } = unntak;

  return (
    <div className="rounded-xl bg-ax-bg-neutral-soft p-5">
      <Heading level="4" size="xsmall" spacing>
        Oppfølgingsplan ikke aktuell
      </Heading>

      <BodyShort size="small" className="mb-1">
        Meldt dato: {getFormattedDateString(meldtTidspunkt)}
      </BodyShort>

      {meldtAv.navn && (
        <BodyShort size="small">Meldt av: {meldtAv.navn}</BodyShort>
      )}
    </div>
  );
}
