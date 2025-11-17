import { BodyLong, Heading } from "@navikt/ds-react";
import { getAGOversiktHref } from "@/constants/route-hrefs";
import Breadcrumbs from "@/ui/Breadcrumbs";

export default async function NarmesteLederOversiktPage({
  params,
}: PageProps<"/[narmesteLederId]/[planId]">) {
  const { narmesteLederId, planId } = await params;

  return (
    <>
      <Breadcrumbs
        firstCrumbOppfolgingsplanerHref={getAGOversiktHref(narmesteLederId)}
        secondCrumbText="Oppfølgingsplan"
        className="mb-6"
      />

      <Heading level="2" size="xlarge" spacing>
        Oppfølgingsplan
      </Heading>

      {/* TODO: Gjøre ferdig */}
      <BodyLong>Plan ID: {planId}</BodyLong>
    </>
  );
}
