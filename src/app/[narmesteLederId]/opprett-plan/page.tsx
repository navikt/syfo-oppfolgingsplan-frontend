import { Suspense } from "react";
import { Heading } from "@navikt/ds-react";
import { getAGOversiktHref } from "@/common/route-hrefs";
import LagPlanVeiviser from "@/components/OpprettPlanPage/LagPlanVeiviser";
import { fetchUtkastDataForAG } from "@/server/fetchData/arbeidsgiver/fetchUtkastPlanForAG";
import { BigLoadingSpinner } from "@/ui/BigLoadingSpinner";
import Breadcrumbs from "@/ui/Breadcrumbs";

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
        className="mb-6"
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
