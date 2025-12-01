"use client";

import { ReactNode, useEffect } from "react";
import { useParams } from "next/navigation";
import { setBreadcrumbs } from "@navikt/nav-dekoratoren-moduler";
import { getSMAktivPlanHref, getSMOversiktHref } from "@/common/route-hrefs";
import { publicEnv } from "@/env-variables/publicEnv";

export default function AktivPlanLayoutForSM({
  children,
}: {
  children: ReactNode;
}) {
  const { planId } = useParams<{ planId: string }>();

  useEffect(() => {
    setBreadcrumbs([
      {
        url: publicEnv.NEXT_PUBLIC_MIN_SIDE_ROOT,
        title: "Min side",
      },
      {
        url: publicEnv.NEXT_PUBLIC_DITT_SYKEFRAVAER_URL,
        title: "Ditt sykefravær",
      },
      {
        url: `${publicEnv.NEXT_PUBLIC_BASE_PATH}${getSMOversiktHref()}`,
        title: "Oppfølgingsplaner",
      },
      {
        url: `${publicEnv.NEXT_PUBLIC_BASE_PATH}${getSMAktivPlanHref(planId)}`,
        title: "Aktiv plan",
      },
    ]);
  }, [planId]);

  return <>{children}</>;
}
