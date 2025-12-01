"use server";

import { isLocalOrDemo } from "@/env-variables/envHelpers";
import { OppfolgingsplanForm } from "@/schema/oppfolgingsplanFormSchemas";
import { TokenXTargetApi } from "../auth/tokenXExchange";
import { simulateBackendDelay } from "../fetchData/mockData/simulateBackendDelay";
import { tokenXFetchUpdate } from "../tokenXFetch/tokenXFetchUpdate";

export type LagreUtkastActionState = {
  isLastSaveSuccess: boolean;
  lastSavedTime: Date | null;
  lastSavedValues: OppfolgingsplanForm | null;
};

export async function lagreUtkastServerAction(
  values: OppfolgingsplanForm,
): Promise<LagreUtkastActionState> {
  if (isLocalOrDemo) {
    await simulateBackendDelay();

    return {
      isLastSaveSuccess: true,
      lastSavedTime: new Date(),
      lastSavedValues: values,
    };
  }

  // validere mot zod skjema

  // maybe map values to backend format

  await tokenXFetchUpdate({
    targetApi: TokenXTargetApi.SYFO_OPPFOLGINGSPLAN_BACKEND,
    endpoint: "TODO",
    method: "PUT",
    requestBody: { values },
  });

  // TODO
  return {
    isLastSaveSuccess: true,
    lastSavedTime: new Date(),
    lastSavedValues: values,
  };
}
