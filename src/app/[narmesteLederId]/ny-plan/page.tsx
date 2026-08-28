import { Heading } from "@navikt/ds-react";
import { Suspense } from "react";
import { getAGOversiktHref } from "@/common/route-hrefs";
import LagPlanVeiviser from "@/components/NyPlanSide/LagPlanVeiviser";
import { erNarmesteLederINavTiltaksgruppe } from "@/server/fetchData/arbeidsgiver/erNarmesteLederINavTiltaksgruppe";
import { fetchUtkastDataForAG } from "@/server/fetchData/arbeidsgiver/fetchUtkastPlan";
import { BigLoadingSpinner } from "@/ui/BigLoadingSpinner";
import Breadcrumbs from "@/ui/Breadcrumbs";

export default async function NyPlanPage({
  params,
}: PageProps<"/[narmesteLederId]">) {
  const { narmesteLederId } = await params;

  const convertedLagretUtkast = fetchUtkastDataForAG(narmesteLederId);
  const erITiltaksgruppePromise =
    erNarmesteLederINavTiltaksgruppe(narmesteLederId);

  return (
    <section>
      <Breadcrumbs
        firstCrumbOppfolgingsplanerHref={getAGOversiktHref(narmesteLederId)}
        secondCrumbText="Lag oppfølgingsplan"
      />

      <Heading level="2" size="large" spacing>
        Lag oppfølgingsplan
      </Heading>

      <Suspense fallback={<BigLoadingSpinner />}>
        <LagPlanVeiviser
          lagretUtkastPromise={convertedLagretUtkast}
          erITiltaksgruppePromise={erITiltaksgruppePromise}
        />
      </Suspense>
    </section>
  );
}
