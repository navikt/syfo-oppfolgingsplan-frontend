"use server";

import { redirect } from "next/navigation";
import { getAGAktivPlanNyligOpprettetHref } from "@/common/route-hrefs";
import { isLocalOrDemo } from "@/env-variables/envHelpers";
import { OppfolgingsplanForm } from "@/schema/oppfolgingsplanFormSchemas";
import { simulateBackendDelay } from "../fetchData/mockData/simulateBackendDelay";
import { TokenXTargetApi } from "../helpers";
import { tokenXFetchUpdate } from "../tokenXFetch";

export type FerdistillPlanActionState = {
  error: string | null;
};

export async function ferdigstillPlanServerAction(
  oppfolgingsplanFormValues: OppfolgingsplanForm,
  narmesteLederId: string,
): Promise<FerdistillPlanActionState> {
  // validere mot zod skjema

  if (isLocalOrDemo) {
    await simulateBackendDelay();

    redirect(getAGAktivPlanNyligOpprettetHref(narmesteLederId));
  }

  // lage formSnapshot
  const formSnapshot = oppfolgingsplanFormValues; // TODO: lage snapshot

  await tokenXFetchUpdate({
    targetApi: TokenXTargetApi.SYFO_OPPFOLGINGSPLAN_BACKEND,
    endpoint: "TODO",
    requestBody: { formSnapshot },
  });

  // only here to satisfy typescript for now
  return {
    error: null,
  };

  // redirect on success instead
}
