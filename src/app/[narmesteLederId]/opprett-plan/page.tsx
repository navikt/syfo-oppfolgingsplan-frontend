import { Suspense } from "react";
import { Heading } from "@navikt/ds-react";
import { BigLoadingSpinner } from "@/common/components/BigLoadingSpinner";
import Breadcrumbs from "@/common/components/Breadcrumbs";
import { getAGOversiktHref } from "@/common/route-hrefs";
import { fetchUtkastDataForAG } from "@/server/fetchData/arbeidsgiver/fetchUtkastPlanForAG";
import LagPlanVeiviser from "../_components/NyPlan/LagPlanVeiviser";

export default async function NyPlanPage({
  params,
}: PageProps<"/[narmesteLederId]">) {
  const { narmesteLederId } = await params;

  const lagretUtkast = fetchUtkastDataForAG(narmesteLederId);

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
        <LagPlanVeiviser lagretUtkastPromise={lagretUtkast} />
      </Suspense>
    </section>
  );
}
