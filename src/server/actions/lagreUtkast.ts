"use server";

import { LagreUtkastActionState } from "@/components/LagPlanPage/FyllUtPlanSteg/form/hooks/useOppfolgingsplanLagring";
import { OppfolgingsplanForm } from "@/schema/oppfolgingsplanFormSchemas";
import { TokenXTargetApi } from "../helpers";
import { tokenXFetchUpdate } from "../tokenXFetch";

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

export async function lagreUtkast(
  previousState: LagreUtkastActionState,
  values: OppfolgingsplanForm
): Promise<LagreUtkastActionState> {
  console.log("Lagrer utkast...", values);
  await new Promise((resolve) => setTimeout(resolve, 1000)); // simulate async save

  return {
    isLastUtkastSaveSuccess: true,
    utkastLastSavedTime: new Date(),
    lastSavedValues: values,
  };
}
