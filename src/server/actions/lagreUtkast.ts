"use server";

import { tokenXFetchUpdate } from "../tokenXFetch";
import { TokenXAudience } from "../fetchData/helpers";
import { OppfolgingsplanFormFields } from "@/schema/oppfolgingsplanFormSchema";

export async function lagrePlanUtkast(
  utkastInnhold: OppfolgingsplanFormFields
) {
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
