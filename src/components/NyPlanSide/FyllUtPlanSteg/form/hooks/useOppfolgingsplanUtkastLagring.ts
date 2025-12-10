import { startTransition, useActionState } from "react";
import { useParams } from "next/navigation";
import { OppfolgingsplanFormUnderArbeid } from "@/schema/oppfolgingsplanFormSchemas";
import { lagreUtkastServerAction } from "@/server/actions/lagreUtkast";
import { FetchResultError } from "@/server/tokenXFetch/FetchResult";

export interface LagreUtkastActionState {
  error: FetchResultError | null;
  sistLagretTidspunkt: Date | null;
  sistLagretUtkast: OppfolgingsplanFormUnderArbeid | null;
}

export default function useOppfolgingsplanUtkastLagring({
  initialFormValues,
  initialSistLagretTidspunkt,
}: {
  initialFormValues: OppfolgingsplanFormUnderArbeid;
  initialSistLagretTidspunkt: Date | null;
}) {
  const { narmesteLederId } = useParams<{ narmesteLederId: string }>();

  const initialLagreUtkastState: LagreUtkastActionState = {
    error: null,
    sistLagretTidspunkt: initialSistLagretTidspunkt,
    sistLagretUtkast: initialFormValues,
  };

  const [
    { error, sistLagretTidspunkt },
    // If this returned action function is called while the action is already
    // running, the call is queued and will run after the ongoing action is
    // finished.
    // Gotcha: The returned "dispatch" function from useActionState must be
    // called in a transition (or from an action prop) in order not to suspend
    // the calling component during the action. Suspending would show the
    // fallback UI of the nearest <Suspense> boundary during the action. That
    // is why calls to these action functions returned form useActionState are
    // wrapped in startTransition (like below) or triggered from `action` props.
    lagreUtkastIfChangesAction,
    isSavingUtkast,
  ] = useActionState(lagreUtkastIfChangesInnerAction, initialLagreUtkastState);

  /**
   * This underlying action function `lagreUtkastIfChangesInnerAction` is
   * provided the values it returned last time (or the initial state)
   * automatically by `useActionState`.
   * This way, it can compare the new `values` with the previously saved values.
   */
  async function lagreUtkastIfChangesInnerAction(
    previousState: LagreUtkastActionState,
    {
      values,
      onSuccess,
    }: {
      values: OppfolgingsplanFormUnderArbeid;
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
      previousState.sistLagretUtkast,
    );

    let newActionState: LagreUtkastActionState;

    if (hasValuesChangedFromPreviousSave) {
      const result = await lagreUtkastServerAction(narmesteLederId, values);

      if (!result.success) {
        newActionState = {
          sistLagretUtkast: previousState.sistLagretUtkast,
          sistLagretTidspunkt: previousState.sistLagretTidspunkt,
          error: result.error,
        };
      } else {
        newActionState = {
          sistLagretUtkast: values,
          sistLagretTidspunkt: result.data.sistLagretTidspunkt,
          error: null,
        };
      }
    } else {
      newActionState = { ...previousState };
    }

    if (newActionState.error === null) {
      onSuccess?.();
    }

    return newActionState;
  }

  function startLagreUtkastIfChanges({
    values,
    onSuccess,
  }: {
    values: OppfolgingsplanFormUnderArbeid;
    onSuccess?: () => void;
  }) {
    startTransition(() => {
      lagreUtkastIfChangesAction({ values, onSuccess });
    });
  }

  return {
    isSavingUtkast,
    error,
    sistLagretTidspunkt,
    /**
     * Hvis `startLagreUtkastIfChanges` kalles flere ganger etter hverandre med
     * like `values`, blir det bare gjort (maks) en faktisk lagring, også hvis
     * den kalles mens en lagring allerede pågår.
     *
     * Hvis det ikke er noen endringer i values sammenligned med
     * `initialFormValues` vil ikke kall føre til lagring. (Det er også et
     * ux-poeng å ikke endre "sist lagret"-tidspunktet når det ikke gjøres
     * noen endringer.)
     */
    startLagreUtkastIfChanges,
  };
}

type FormFieldValue =
  OppfolgingsplanFormUnderArbeid[keyof OppfolgingsplanFormUnderArbeid];

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
