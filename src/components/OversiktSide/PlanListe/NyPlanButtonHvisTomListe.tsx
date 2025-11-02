import NextLink from "next/link";
import { Box, Button } from "@navikt/ds-react";
import { getAGOpprettNyPlanHref } from "@/constants/route-hrefs";
import { fetchOppfolgingsplanOversiktForAG } from "@/server/fetchData/fetchOppfolgingsplanOversiktForAG";

export default async function NyPlanButtonHvisTomListe({
  narmesteLederId,
}: {
  narmesteLederId: string;
}) {
  const {
    oppfolgingsplan: aktivPlan,
    previousOppfolgingsplaner: tidligerePlaner,
    utkast,
  } = await fetchOppfolgingsplanOversiktForAG(narmesteLederId);

  const harTomListe =
    aktivPlan === null || tidligerePlaner.length === 0 || utkast === null;

  return (
    harTomListe && (
      <LagNyOppfolgingsplanButton narmesteLederId={narmesteLederId} />
    )
  );
}

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
        href={getAGOpprettNyPlanHref(narmesteLederId)}
      >
        Lag en ny oppfølgingsplan
      </Button>
    </Box>
  );
}
