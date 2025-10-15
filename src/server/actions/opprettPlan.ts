"use server";

import { UtfyltOppfolgingsplan } from "@/schema/oppfolgingsplanFormSchema";
import { tokenXFetchUpdate } from "../tokenXFetch";
import { TokenXAudience } from "../fetchData/helpers";

export async function opprettPlan(
  utfyltOppfolgingsplan: UtfyltOppfolgingsplan
) {
  // validere mot zod skjema hvis ikke allerede gjort

  // lage formSnapshot
  const formSnapshot = utfyltOppfolgingsplan; // TODO: lage snapshot

  tokenXFetchUpdate({
    audience: TokenXAudience.SYFO_OPPFOLGINGSPLAN_BACKEND,
    endpoint: "TODO",
    requestBody: { formSnapshot },
  });

  // redirect?
}
