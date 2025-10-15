"use server";

import { OppfolgingsplanUnderUtfylling } from "@/schema/oppfolgingsplanFormSchema";
import { tokenXFetchUpdate } from "../tokenXFetch";
import { TokenXAudience } from "../fetchData/helpers";

export async function lagrePlanUtkast(
  oppfolgingsplanUnderUtfylling: OppfolgingsplanUnderUtfylling
) {
  // validere mot zod skjema hvis ikke allerede gjort

  // lage formSnapshot
  const formSnapshot = oppfolgingsplanUnderUtfylling; // TODO: lage snapshot

  tokenXFetchUpdate({
    audience: TokenXAudience.SYFO_OPPFOLGINGSPLAN_BACKEND,
    endpoint: "TODO",
    method: "PUT",
    requestBody: { formSnapshot },
  });
}
