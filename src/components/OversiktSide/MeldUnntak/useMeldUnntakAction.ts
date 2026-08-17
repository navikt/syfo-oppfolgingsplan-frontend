import { useParams } from "next/navigation";
import { startTransition, useActionState } from "react";
import { meldUnntaksvurderingServerAction } from "@/server/actions/meldUnntaksvurdering";
import type { FetchUpdateResult } from "@/server/tokenXFetch/FetchResult";

interface ActionPayload {
  onSuccess: () => void;
}

export default function useMeldUnntakAction() {
  const { narmesteLederId } = useParams<{ narmesteLederId: string }>();
  const [{ error }, meldUnntakAction, isPending] = useActionState(
    innerMeldUnntakAction,
    { error: null },
  );

  async function innerMeldUnntakAction(
    _previousState: FetchUpdateResult,
    { onSuccess }: ActionPayload,
  ): Promise<FetchUpdateResult> {
    const result = await meldUnntaksvurderingServerAction(narmesteLederId);

    if (result.error === null) {
      onSuccess();
    }

    return result;
  }

  function meldUnntak(onSuccess: () => void) {
    startTransition(() => {
      meldUnntakAction({ onSuccess });
    });
  }

  return { error, isPending, meldUnntak };
}
