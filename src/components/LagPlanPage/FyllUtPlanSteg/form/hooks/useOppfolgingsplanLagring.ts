import { useRef, useState } from "react";
import { OppfolgingsplanForm } from "@/schema/oppfolgingsplanFormSchemas";

export default function useOppfolgingsplanLagring() {
  const { isChangedSinceBookmark, setBookmark } = useFormValuesBookmark();
  const [isSavingUtkast, setIsSavingUtkast] = useState(false);
  const [utkastSistLagretTid, SetUtkastSistLagretTid] = useState<Date | null>(
    null
  );
  const [isAutoSavingEnabled, setIsAutoSavingEnabled] = useState(true);

  async function lagreUtkastHvisEndringer(values: OppfolgingsplanForm) {
    if (isChangedSinceBookmark(values)) {
      setIsSavingUtkast(true);

      // Implementation for auto-saving draft
      await new Promise((resolve) => setTimeout(resolve, 500)); // simulate async save

      setIsSavingUtkast(false);
      setBookmark(values);
      SetUtkastSistLagretTid(new Date());
    }
  }

  async function autolagreUtkastHvisEndringer(values: OppfolgingsplanForm) {
    if (isAutoSavingEnabled) {
      await lagreUtkastHvisEndringer(values);
    }
  }

  async function skruAvAutoLagringOgLagreUtkast(values: OppfolgingsplanForm) {
    setIsAutoSavingEnabled(false);
    await lagreUtkastHvisEndringer(values);
  }

  async function skruPaAutoLagring() {
    setIsAutoSavingEnabled(true);
  }

  async function ferdigstillPlan() {}

  return {
    isSavingUtkast,
    autolagreUtkastHvisEndringer,
    skruAvAutoLagringOgLagreUtkast,
    skruPaAutoLagring,
    ferdigstillPlan,
    utkastSistLagretTid,
  };
}

function useFormValuesBookmark() {
  const bookmarkedValuesRef = useRef<OppfolgingsplanForm>(null);

  const setBookmark = (formValues: OppfolgingsplanForm) => {
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

function areSimpleObjectsEqual<
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
