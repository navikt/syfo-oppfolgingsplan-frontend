import { startTransition, useActionState, useRef } from "react";
import { OppfolgingsplanForm } from "@/schema/oppfolgingsplanFormSchemas";
import { lagreUtkast } from "@/server/actions/lagreUtkast";

export type LagreUtkastActionState = {
  isLastUtkastSaveSuccess: boolean;
  utkastLastSavedTime: Date | null;
  lastSavedValues: OppfolgingsplanForm | null;
};

// TODO: object parameter
export default function useOppfolgingsplanLagring(
  initialLastSavedValues: OppfolgingsplanForm | null,
  initialLastSavedDate: Date | null
) {
  // const { isChangedSinceBookmark, setBookmark } = useFormValuesBookmark();

  const [
    { isLastUtkastSaveSuccess, utkastLastSavedTime, lastSavedValues },
    autoLagreUtkastAction,
    isSavingUtkast,
  ] = useActionState(lagreUtkast, {
    isLastUtkastSaveSuccess: true,
    utkastLastSavedTime: initialLastSavedDate,
    lastSavedValues: initialLastSavedValues,
  });

  async function lagreUtkastHvisEndringer(values: OppfolgingsplanForm) {
    if (!lastSavedValues || !areSimpleObjectsEqual(lastSavedValues, values)) {
      await lagreUtkast(
        {
          isLastUtkastSaveSuccess: true,
          lastSavedValues,
          utkastLastSavedTime,
        },
        values
      );
    }
  }

  async function ferdigstillPlan() {}

  return {
    isSavingUtkast,
    isLastUtkastSaveSuccess,
    utkastLastSavedTime,
    autoLagreUtkastAction,
    lagreUtkastHvisEndringer,
    ferdigstillPlan,
  };
}

function useFormValuesBookmark() {
  const bookmarkedValuesRef = useRef<OppfolgingsplanForm>(null);

  const setBookmark = (formValues: OppfolgingsplanForm) => {
    console.log("setBookmark called with:", formValues);
    bookmarkedValuesRef.current = structuredClone(formValues);
  };

  const isChangedSinceBookmark = (formValues: OppfolgingsplanForm) =>
    !bookmarkedValuesRef.current ||
    !areSimpleObjectsEqual(bookmarkedValuesRef.current, formValues);

  return {
    setBookmark,
    isChangedSinceBookmark,
  };
}

export function areSimpleObjectsEqual<
  T extends Record<string, Date | string | number | boolean | null | undefined>,
>(a: T, b: T): boolean {
  if (!a || !b) return false;

  const aKeys = Object.keys(a);

  for (const key of aKeys) {
    // b has the key?
    if (!Object.prototype.hasOwnProperty.call(b, key)) return false;

    // Handle Date values
    if (a[key] instanceof Date && b[key] instanceof Date) {
      if (a[key].getTime() !== b[key].getTime()) return false;
      continue;
    }

    // Use Object.is for correct handling of NaN and -0/+0
    if (!Object.is(a[key], b[key])) return false;
  }
  return true;
}
