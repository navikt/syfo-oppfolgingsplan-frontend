"use server";

import { OppfolgingsplanInnhold } from "@/schema/oppfolgingsplanFormSchema";
import { tokenXFetchUpdate } from "../tokenXFetch";
import { TokenXAudience } from "../fetchData/helpers";

export async function opprettPlan(nyPlanInnhold: OppfolgingsplanInnhold) {
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
