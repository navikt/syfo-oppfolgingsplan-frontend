import { Heading } from "@navikt/ds-react";
import { Suspense } from "react";
import { getAGOversiktHref } from "@/common/route-hrefs";
import NyPlanSkjema from "@/components/NyPlanSide/NyPlanSkjema";
import { fetchUtkastDataForAG } from "@/server/fetchData/arbeidsgiver/fetchUtkastPlan";
import { hentTiltakspakkeContext } from "@/server/fetchData/arbeidsgiver/hentTiltakspakkeContext";
import { BigLoadingSpinner } from "@/ui/BigLoadingSpinner";
import Breadcrumbs from "@/ui/Breadcrumbs";

export default async function NyPlanPage({
  params,
}: PageProps<"/[narmesteLederId]">) {
  const { narmesteLederId } = await params;

  const convertedLagretUtkast = fetchUtkastDataForAG(narmesteLederId);
  const tiltakspakkePromise = hentTiltakspakkeContext(narmesteLederId);

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
        <NyPlanSkjema
          key={narmesteLederId}
          narmesteLederId={narmesteLederId}
          lagretUtkastPromise={convertedLagretUtkast}
          tiltakspakkePromise={tiltakspakkePromise}
        />
      </Suspense>
    </section>
  );
}
