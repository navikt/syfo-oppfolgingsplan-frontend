import NextLink from "next/link";
import { Box, Button } from "@navikt/ds-react";
import { fetchOppfolgingsplanOversiktForAG } from "@/server/fetchData/fetchOppfolgingsplanOversiktForAG";
import { getAGNyPlanHref } from "@/constants/route-hrefs";
import PlanListeForArbeidsgiver from "@/components/OversiktSide/PlanListe/PlanListe";

function LagNyOppfolgingsplanButton({
  narmesteLederId,
}: {
  narmesteLederId: string;
}) {
  return (
    <Box className="mb-12">
      <Button
        variant="primary"
        as={NextLink}
        href={getAGNyPlanHref(narmesteLederId)}
      >
        Lag en ny oppfølgingsplan
      </Button>
    </Box>
  );
}

export default async function LagNyPlanKnappOgPlanListe({
  narmesteLederId,
}: {
  narmesteLederId: string;
}) {
  const {
    oppfolgingsplan: aktivPlan,
    previousOppfolgingsplaner: tidligerePlaner,
    utkast,
  } = await fetchOppfolgingsplanOversiktForAG(narmesteLederId);

  // TODO: Hent fra backend
  const arbeidsstedNavn = "Arbeidssted AS";

  const harMinstEnPlanEllerUtkast =
    aktivPlan || tidligerePlaner.length > 0 || utkast;

  return (
    <section>
      {!harMinstEnPlanEllerUtkast && (
        <LagNyOppfolgingsplanButton narmesteLederId={narmesteLederId} />
      )}

      {harMinstEnPlanEllerUtkast && (
        <PlanListeForArbeidsgiver
          narmesteLederId={narmesteLederId}
          aktivPlan={aktivPlan}
          utkast={utkast}
          tidligerePlaner={tidligerePlaner}
          arbeidsstedNavn={arbeidsstedNavn}
        />
      )}
    </section>
  );
}
