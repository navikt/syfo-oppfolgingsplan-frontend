"use server";

import { tokenXFetchUpdate } from "../tokenXFetch";
import { TokenXAudience } from "../fetchData/helpers";

export async function delPlanMedVeileder(planUuid: string) {
  // validere mot zod skjema

  tokenXFetchUpdate({
    audience: TokenXAudience.SYFO_OPPFOLGINGSPLAN_BACKEND,
    endpoint: `TODO/${planUuid}`,
    requestBody: "TODO",
  });
}
