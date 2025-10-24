"use server";

import { tokenXFetchUpdate } from "../tokenXFetch";
import { TokenXTargetApi } from "../helpers";

export async function delPlanMedVeileder(planUuid: string) {
  // validere mot zod skjema

  tokenXFetchUpdate({
    targetApi: TokenXTargetApi.SYFO_OPPFOLGINGSPLAN_BACKEND,
    endpoint: `TODO/${planUuid}`,
    requestBody: "TODO",
  });
}
