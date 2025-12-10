import { useActionState } from "react";
import { useParams } from "next/navigation";
import { slettUtkastServerAction } from "@/server/actions/slettUtkast";
import { FetchUpdateResult } from "@/server/tokenXFetch/FetchResult";

type ActionPayload = {
  onSuccess: () => void;
};

export default function useSlettUtkastAction() {
  const { narmesteLederId } = useParams<{ narmesteLederId: string }>();

  const initialSlettUtkastState: FetchUpdateResult = {
    success: true,
    data: undefined,
  };

  const [result, slettUtkastAction, isPendingSlettUtkast] = useActionState(
    innerSlettUtkastAction,
    initialSlettUtkastState,
  );

  async function innerSlettUtkastAction(
    _previousState: FetchUpdateResult,
    { onSuccess }: ActionPayload,
  ): Promise<FetchUpdateResult> {
    const actionState = await slettUtkastServerAction(narmesteLederId);

    if (actionState.success) {
      onSuccess();
    }

    return actionState;
  }

  return {
    slettUtkastAction,
    isPendingSlettUtkast,
    error: !result.success ? result.error : null,
  };
}
