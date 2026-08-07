import { InfoCard } from "@navikt/ds-react";
// Subkomponenter importeres flatt fra subpath — compound-varianten
// (InfoCard.Header) brekker under Next sin optimizePackageImports.
import {
  InfoCardContent,
  InfoCardHeader,
  InfoCardTitle,
} from "@navikt/ds-react/InfoCard";
import { fetchOppfolgingsplanOversiktForAG } from "@/server/fetchData/arbeidsgiver/fetchOppfolgingsplanOversikt";
import { getFormattedDateString } from "@/ui-helpers/dateAndTime";

/**
 * Rolig, stående tilstand når arbeidsgiver har meldt at oppfølgingsplan ikke
 * er aktuell nå (gjeldendeStatus IKKE_AKTUELT fra backend). Nøytralt InfoCard,
 * ikke et varsel — et meldt unntak krever ingen oppmerksomhet.
 */
export default async function GjeldendeUnntakInfoCard({
  narmesteLederId,
}: {
  narmesteLederId: string;
}) {
  const oversiktResult =
    await fetchOppfolgingsplanOversiktForAG(narmesteLederId);

  if (oversiktResult.error) return null;

  const { gjeldendeStatus, unntaksvurderinger } = oversiktResult.data.oversikt;

  // Backend eier statusberegningen (presedens AKTIV_PLAN > UTKAST >
  // IKKE_AKTUELT > INGEN) — frontend regner ikke selv på listene.
  if (gjeldendeStatus !== "IKKE_AKTUELT") return null;

  const nyesteUnntak = unntaksvurderinger[0];
  if (!nyesteUnntak) return null;

  const { meldtTidspunkt, meldtAv } = nyesteUnntak;

  return (
    <InfoCard data-color="neutral" className="mb-8">
      <InfoCardHeader>
        <InfoCardTitle as="h3">
          Ikke aktuelt med oppfølgingsplan nå
        </InfoCardTitle>
      </InfoCardHeader>
      <InfoCardContent>
        Registrert {getFormattedDateString(meldtTidspunkt)}
        {meldtAv.navn ? ` av ${meldtAv.navn}` : ""}. Endrer situasjonen seg, kan
        dere når som helst lage en plan.
      </InfoCardContent>
    </InfoCard>
  );
}
