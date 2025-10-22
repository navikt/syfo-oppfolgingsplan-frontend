"use server";

import { tokenXFetchUpdate } from "../tokenXFetch";
import { TokenXAudience } from "../helpers";
import { OppfolgingsplanFormFields } from "@/schema/oppfolgingsplanFormSchema";

export async function opprettPlan(nyPlanInnhold: OppfolgingsplanFormFields) {
  // validere mot zod skjema

  // lage formSnapshot
  const formSnapshot = nyPlanInnhold; // TODO: lage snapshot

  tokenXFetchUpdate({
    audience: TokenXAudience.SYFO_OPPFOLGINGSPLAN_BACKEND,
    endpoint: "TODO",
    requestBody: { formSnapshot },
  });

  // redirect?
}
