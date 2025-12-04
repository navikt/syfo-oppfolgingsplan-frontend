import { Suspense } from "react";
import {
  NYLIG_OPPRETTET_SEARCH_PARAM,
  getAGOversiktHref,
} from "@/common/route-hrefs";
import AktivPlanForAG from "@/components/FerdigstiltPlanSider/AktivPlanSide/AktivPlanForAG";
import { BigLoadingSpinner } from "@/ui/BigLoadingSpinner.tsx";
import Breadcrumbs from "@/ui/Breadcrumbs";

export default async function AktivPlanPageForAG({
  params,
  searchParams,
}: PageProps<"/[narmesteLederId]/aktiv-plan">) {
  const { narmesteLederId } = await params;
  const { [NYLIG_OPPRETTET_SEARCH_PARAM]: nyligOpprettetParam } =
    await searchParams;

  return (
    <>
      <Breadcrumbs
        firstCrumbOppfolgingsplanerHref={getAGOversiktHref(narmesteLederId)}
        secondCrumbText="Aktiv plan"
      />

      <Suspense fallback={<BigLoadingSpinner />}>
        <AktivPlanForAG
          narmesteLederId={narmesteLederId}
          nyligOpprettet={nyligOpprettetParam === "true"}
        />
      </Suspense>
    </>
  );
}
