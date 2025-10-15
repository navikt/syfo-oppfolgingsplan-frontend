import NextLink from "next/link";
import { Box, Button } from "@navikt/ds-react";
import { fetchOppfolgingsplanOversiktForNL } from "@/server/fetchData/fetchOppfolgingsplanOversiktForNL";
import { SykmeldtTilstand } from "@/constants/enums";
import { getHrefAGOpprettPlan } from "@/constants/route-hrefs";
import PlanListe from "@/components/PlanOversikt/PlanListe/PlanListe";
import IkkeSykmeldtAlert from "./IkkeSykmeldtAlert";

export default async function LagPlanKnappOgPlanListe({
  narmesteLederId,
}: {
  narmesteLederId: string;
}) {
  const { oppfolgingsplan, previousOppfolgingsplaner, utkast } =
    await fetchOppfolgingsplanOversiktForNL(narmesteLederId);

  // TODO: Hent fra backend
  const sykmeldtTilstand = SykmeldtTilstand.SYKMELDT;

  const harMinstEnPlanEllerUtkast =
    oppfolgingsplan || previousOppfolgingsplaner.length > 0 || utkast;

  const lagNyPlanKnapp = (
    <Box className="mb-12">
      <Button
        variant="primary"
        as={NextLink}
        href={getHrefAGOpprettPlan(narmesteLederId)}
      >
        Lag en ny oppfølgingsplan
      </Button>
    </Box>
  );

  return (
    <section>
      {sykmeldtTilstand === SykmeldtTilstand.SYKMELDT &&
        !harMinstEnPlanEllerUtkast &&
        lagNyPlanKnapp}

      {sykmeldtTilstand !== SykmeldtTilstand.SYKMELDT && (
        <IkkeSykmeldtAlert className="mb-12" />
      )}

      {harMinstEnPlanEllerUtkast && (
        <PlanListe
          aktivPlan={oppfolgingsplan}
          utkast={utkast}
          tidligerePlaner={previousOppfolgingsplaner}
        />
      )}
    </section>
  );
}
