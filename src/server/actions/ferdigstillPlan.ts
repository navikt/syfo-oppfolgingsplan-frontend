"use server";

import { OppfolgingsplanFormKlarTilFerdigstilling } from "@/schema/oppfolgingsplanFormSchemas";
import { tokenXFetchUpdate } from "../tokenXFetch";
import { TokenXTargetApi } from "../helpers";

export async function ferdigstillPlan(
  oppfolgingsplanTilFerdigstilling: OppfolgingsplanFormKlarTilFerdigstilling
) {
  // validere mot zod skjema hvis ikke allerede gjort

  // lage formSnapshot
  const formSnapshot = oppfolgingsplanTilFerdigstilling; // TODO: lage snapshot

  tokenXFetchUpdate({
    targetApi: TokenXTargetApi.SYFO_OPPFOLGINGSPLAN_BACKEND,
    endpoint: "TODO",
    requestBody: { formSnapshot },
  });

  // redirect?
}
