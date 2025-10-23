"use server";

import { tokenXFetchUpdate } from "../tokenXFetch";
import { TokenXTargetApi } from "../helpers";
import { OppfolgingsplanFormFields } from "@/schema/oppfolgingsplanFormSchema";

export async function lagrePlanUtkast(
  utkastInnhold: OppfolgingsplanFormFields
) {
  // validere mot zod skjema

  // lage formSnapshot
  const formSnapshot = utkastInnhold; // TODO: lage snapshot

  tokenXFetchUpdate({
    targetApi: TokenXTargetApi.SYFO_OPPFOLGINGSPLAN_BACKEND,
    endpoint: "TODO",
    method: "PUT",
    requestBody: { formSnapshot },
  });
}
