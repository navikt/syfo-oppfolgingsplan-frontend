"use server";

import { redirect } from "next/navigation";
import { getAGOppfolgingplanHref } from "@/constants/route-hrefs";
import { isLocalOrDemo } from "@/env-variables/envHelpers";
import { OppfolgingsplanForm } from "@/schema/oppfolgingsplanFormSchemas";
import { simulateBackendDelay } from "../fetchData/demoMockData/simulateBackendDelay";
import { TokenXTargetApi } from "../helpers";
import { tokenXFetchUpdate } from "../tokenXFetch";

export async function ferdigstillPlanServerAction(
  oppfolgingsplanFormValues: OppfolgingsplanForm,
  narmesteLederId: string
) {
  // validere mot zod skjema

  if (isLocalOrDemo) {
    await simulateBackendDelay();
    const planId = "12345";

    redirect(getAGOppfolgingplanHref(narmesteLederId, planId));
  }

  // lage formSnapshot
  const formSnapshot = oppfolgingsplanFormValues; // TODO: lage snapshot

  tokenXFetchUpdate({
    targetApi: TokenXTargetApi.SYFO_OPPFOLGINGSPLAN_BACKEND,
    endpoint: "TODO",
    requestBody: { formSnapshot },
  });

  // redirect?
}
