"use server";

import { LagreUtkastActionState } from "@/components/OpprettPlanPage/FyllUtPlanSteg/form/hooks/useOppfolgingsplanLagring";
import { isLocalOrDemo } from "@/env-variables/envHelpers";
import { OppfolgingsplanForm } from "@/schema/oppfolgingsplanFormSchemas";
import { simulateBackendDelay } from "../fetchData/demoMockData/simulateBackendDelay";
import { TokenXTargetApi } from "../helpers";
import { tokenXFetchUpdate } from "../tokenXFetch";

export async function lagreUtkastServerAction(
  values: OppfolgingsplanForm
): Promise<LagreUtkastActionState> {
  if (isLocalOrDemo) {
    await simulateBackendDelay();

    return {
      isLastUtkastSaveSuccess: true,
      utkastLastSavedTime: new Date(),
      lastSavedValues: values,
    };
  }

  // validere mot zod skjema

  // maybe map values to backend format

  tokenXFetchUpdate({
    targetApi: TokenXTargetApi.SYFO_OPPFOLGINGSPLAN_BACKEND,
    endpoint: "TODO",
    method: "PUT",
    requestBody: { values },
  });

  // TODO
  return {
    isLastUtkastSaveSuccess: true,
    utkastLastSavedTime: new Date(),
    lastSavedValues: values,
  };
}
