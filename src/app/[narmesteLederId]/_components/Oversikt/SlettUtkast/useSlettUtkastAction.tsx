import { useActionState } from "react";
import { useParams } from "next/navigation";
import { FerdistillPlanActionState } from "@/server/actions/arbeidsgiver/ferdigstillPlan";
import {
  SlettUtkastActionState,
  slettUtkastServerAction,
} from "@/server/actions/arbeidsgiver/slettUtkast";

type ActionPayload = {
  onSuccess: () => void;
};

export default function useSlettUtkastAction() {
  const { narmesteLederId } = useParams<{ narmesteLederId: string }>();

  const initialSlettUtkastState: SlettUtkastActionState = { error: null };

  const [{ error }, slettUtkastAction, isPendingSlettUtkast] = useActionState(
    innerSlettUtkastAction,
    initialSlettUtkastState,
  );

  async function innerSlettUtkastAction(
    _previousState: FerdistillPlanActionState,
    { onSuccess }: ActionPayload,
  ): Promise<FerdistillPlanActionState> {
    const actionState = await slettUtkastServerAction(narmesteLederId);

    if (actionState.error === null) {
      onSuccess();
    }

    return actionState;
  }

  return {
    slettUtkastAction,
    isPendingSlettUtkast,
    error,
  };
}
