import { useActionState } from "react";
import { useParams } from "next/navigation";
import { slettUtkastServerAction } from "@/server/actions/slettUtkast";
import { FetchUpdateResult } from "@/server/tokenXFetch/FetchResult";

type ActionPayload = {
  onSuccess: () => void;
};

export default function useSlettUtkastAction() {
  const { narmesteLederId } = useParams<{ narmesteLederId: string }>();

  const [{ error }, slettUtkastAction, isPendingSlettUtkast] = useActionState(
    innerSlettUtkastAction,
    { error: null },
  );

  async function innerSlettUtkastAction(
    _previousState: FetchUpdateResult,
    { onSuccess }: ActionPayload,
  ): Promise<FetchUpdateResult> {
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
