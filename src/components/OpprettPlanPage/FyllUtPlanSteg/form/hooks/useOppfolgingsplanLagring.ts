import { startTransition, useActionState, useTransition } from "react";
import { useParams } from "next/navigation";
import { OppfolgingsplanForm } from "@/schema/oppfolgingsplanFormSchemas";
import { ferdigstillPlanServerAction } from "@/server/actions/ferdigstillPlan";
import { lagreUtkastServerAction } from "@/server/actions/lagreUtkast";

export type LagreUtkastActionState = {
  isLastUtkastSaveSuccess: boolean;
  utkastLastSavedTime: Date | null;
  lastSavedValues: OppfolgingsplanForm | null;
};

export default function useOppfolgingsplanLagring({
  initialFormValues,
  initialLastSavedTime,
}: {
  initialFormValues: OppfolgingsplanForm;
  initialLastSavedTime: Date | null;
}) {
  const { narmesteLederId } = useParams<{ narmesteLederId: string }>();

  const [isPendingFerdigstillPlan, startFerdigstillPlanTransition] =
    useTransition();

  const [
    { isLastUtkastSaveSuccess, utkastLastSavedTime },
    saveUtkastDispatchAction,
    isSavingUtkast,
  ] = useActionState(saveUtkastAction, {
    isLastUtkastSaveSuccess: true,
    utkastLastSavedTime: initialLastSavedTime,
    lastSavedValues: initialFormValues,
  });

  async function saveUtkastAction(
    previouslyReturnedValues: LagreUtkastActionState,
    {
      values,
      onSuccess,
    }: {
      values: OppfolgingsplanForm;
      onSuccess?: () => void;
    }
  ) {
    // Doing this check and doing it here so that saves can be "queued" up from
    // both auto-save and proceed/exit saves without triggering "double saves".
    const hasValuesChangedFromPreviousSave = !areFormStateObjectsEqual(
      values,
      previouslyReturnedValues.lastSavedValues
    );

    const { isLastUtkastSaveSuccess, lastSavedValues, utkastLastSavedTime } =
      hasValuesChangedFromPreviousSave
        ? await lagreUtkastServerAction(values)
        : previouslyReturnedValues;

    if (isLastUtkastSaveSuccess) {
      onSuccess?.();
    }

    return {
      isLastUtkastSaveSuccess,
      lastSavedValues,
      utkastLastSavedTime,
    };
  }

  function startSaveUtkast({
    values,
    onSuccess,
  }: {
    values: OppfolgingsplanForm;
    onSuccess?: () => void;
  }) {
    startTransition(() => {
      saveUtkastDispatchAction({ values, onSuccess });
    });
  }

  async function startFerdigstillPlan(values: OppfolgingsplanForm) {
    startFerdigstillPlanTransition(async () => {
      await ferdigstillPlanServerAction(values, narmesteLederId);
    });
  }

  return {
    isSavingUtkast,
    isLastUtkastSaveSuccess,
    utkastLastSavedTime,
    startSaveUtkast,
    startFerdigstillPlan,
    isPendingFerdigstillPlan,
  };
}

type FormFieldValue = OppfolgingsplanForm[keyof OppfolgingsplanForm];

function areFormStateObjectsEqual(
  a: Record<string, FormFieldValue> | null,
  b: Record<string, FormFieldValue> | null
): boolean {
  if (!a || !b) return false;

  const aKeys = Object.keys(a);
  if (aKeys.length !== Object.keys(b).length) return false;

  for (const key of aKeys) {
    if (!Object.prototype.hasOwnProperty.call(b, key)) return false;

    const av = a[key];
    const bv = b[key];

    if (av instanceof Date && bv instanceof Date) {
      if (av.getTime() !== bv.getTime()) return false;
      continue;
    }

    if (!Object.is(av, bv)) return false;
  }
  return true;
}
