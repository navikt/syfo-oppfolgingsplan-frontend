"use server";

import { OppfolgingsplanInnhold } from "@/schema/oppfolgingsplanFormSchema";
import { tokenXFetchUpdate } from "../tokenXFetch";
import { TokenXAudience } from "../fetchData/helpers";

export async function lagrePlanUtkast(utkastInnhold: OppfolgingsplanInnhold) {
  // validere mot zod skjema

  // lage formSnapshot
  const formSnapshot = utkastInnhold; // TODO: lage snapshot

  tokenXFetchUpdate({
    audience: TokenXAudience.SYFO_OPPFOLGINGSPLAN_BACKEND,
    endpoint: "TODO",
    method: "PUT",
    requestBody: { formSnapshot },
  });
}
