"use server";

import { tokenXFetchUpdate } from "../tokenXFetch";
import { TokenXTargetApi } from "../helpers";

export async function lagrePlanUtkast(oppfolgingsplanUnderUtfylling: unknown) {
  // validere mot zod skjema hvis ikke allerede gjort

  // lage formSnapshot
  const formSnapshot = oppfolgingsplanUnderUtfylling; // TODO: lage snapshot

  tokenXFetchUpdate({
    targetApi: TokenXTargetApi.SYFO_OPPFOLGINGSPLAN_BACKEND,
    endpoint: "TODO",
    method: "PUT",
    requestBody: { formSnapshot },
  });
}
