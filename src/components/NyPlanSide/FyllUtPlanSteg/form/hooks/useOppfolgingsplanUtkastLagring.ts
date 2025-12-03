import { startTransition, useActionState } from "react";
import { OppfolgingsplanForm } from "@/schema/oppfolgingsplanFormSchemas";
import {
  LagreUtkastActionState,
  lagreUtkastServerAction,
} from "@/server/actions/lagreUtkast";

export default function useOppfolgingsplanUtkastLagring({
  initialFormValues,
  initialLastSavedTime,
}: {
  initialFormValues: OppfolgingsplanForm;
  initialLastSavedTime: Date | null;
}) {
  const initialLagreUtkastState: LagreUtkastActionState = {
    isLastSaveSuccess: true,
    lastSavedTime: initialLastSavedTime,
    lastSavedValues: initialFormValues,
  };

  const [
    { isLastSaveSuccess, lastSavedTime },
    // If this returned action function is called while the action is already running,
    // the call is queued and will run after the ongoing action is finished.
    //
    // Gotcha: This returned "dispatch" function must be called in a transition
    // (or from an action prop) in order not to suspend the calling component during the action.
    // Suspending would show the fallback UI of the nearest <Suspense> boundary during the action.
    lagreUtkastIfChangesAction,
    isSavingUtkast,
  ] = useActionState(lagreUtkastIfChangesInnerAction, initialLagreUtkastState);

  /**
   * This underlying action function `lagreUtkastIfChangesInnerAction` is
   * provided the values it returned last time (or the initial state)
   * automatically by `useActionState` (see above).
   * This way, it can compare the new `values` with the previously saved values.
   */
  async function lagreUtkastIfChangesInnerAction(
    previousState: LagreUtkastActionState,
    {
      values,
      onSuccess,
    }: {
      values: OppfolgingsplanForm;
      onSuccess?: () => void;
    },
  ) {
    /* Uten denne sjekken, slik det er satt opp nå, vil det alltid bli trigget
     * en lagring når bruker klikker på "Fortsett til oppsummering" eller
     * "Avslutt og fortsett senere", også når brukeren ikke har endret noe etter
     * forrige autolagring, eller ikke endret noe siden innlasting av skjema. I
     * tillegg, hvis autolagring er underveis før bruker trykker på en av knappene,
     * vil det uten denne sjekken bli en ekstra lagring etter autolagringen. Eller
     * hvis bruker trykker raskt på en av knappene etter endring vil det bli gjort
     * en ekstra lagring etter "knapp-trigget lagring".
     * "Sammenlign med sist"-sjekken løser alle disse tingene på et sted. */
    const hasValuesChangedFromPreviousSave = !areFormStateObjectsEqual(
      values,
      previousState.lastSavedValues,
    );

    const { isLastSaveSuccess, lastSavedValues, lastSavedTime } =
      hasValuesChangedFromPreviousSave
        ? await lagreUtkastServerAction(values)
        : previousState;

    if (isLastSaveSuccess) {
      onSuccess?.();
    }

    return {
      isLastSaveSuccess,
      lastSavedValues,
      lastSavedTime,
    };
  }

  function startLagreUtkastIfChanges({
    values,
    onSuccess,
  }: {
    values: OppfolgingsplanForm;
    onSuccess?: () => void;
  }) {
    startTransition(() => {
      lagreUtkastIfChangesAction({ values, onSuccess });
    });
  }

  return {
    isSavingUtkast,
    isLastSaveSuccess,
    lastSavedTime,
    /**
     * Hvis `startLagreUtkastIfChanges` kalles flere etter hverandre med like `values`,
     * blir det bare gjort (maks) en faktisk lagring, også hvis den kalles mens en lagring
     * allerede pågår.
     *
     * Hvis det ikke er noen endringer i values sammenligned med `initialFormValues` vil
     * ikke kall føre til lagring. (Det er også et ux-poeng å ikke endre
     * "sist lagret"-tidspunktet når det ikke gjøres noen endringer.)
     */
    startLagreUtkastIfChanges,
  };
}

type FormFieldValue = OppfolgingsplanForm[keyof OppfolgingsplanForm];

function areFormStateObjectsEqual(
  a: Record<string, FormFieldValue> | null,
  b: Record<string, FormFieldValue> | null,
): boolean {
  if (!a || !b) return false;

  const aKeys = Object.keys(a);
  if (aKeys.length !== Object.keys(b).length) return false;

  for (const key of aKeys) {
    if (!Object.prototype.hasOwnProperty.call(b, key)) return false;

    const av = a[key];
    const bv = b[key];

    if (!Object.is(av, bv)) return false;
  }
  return true;
}
