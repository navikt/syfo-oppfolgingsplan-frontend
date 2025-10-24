"use server";

import { tokenXFetchUpdate } from "../tokenXFetch";
import { TokenXTargetApi } from "../helpers";
import { OppfolgingsplanFormFields } from "@/schema/oppfolgingsplanFormSchema";

export async function opprettPlan(nyPlanInnhold: OppfolgingsplanFormFields) {
  // validere mot zod skjema

  // lage formSnapshot
  const formSnapshot = nyPlanInnhold; // TODO: lage snapshot

  tokenXFetchUpdate({
    targetApi: TokenXTargetApi.SYFO_OPPFOLGINGSPLAN_BACKEND,
    endpoint: "TODO",
    requestBody: { formSnapshot },
  });

  // redirect?
}
