import { useParams, useRouter } from "next/navigation";
import { startTransition, useActionState, useRef } from "react";
import type z from "zod";
import { getAGAktivPlanNyligOpprettetHref } from "@/common/route-hrefs";
import {
  getAidPlanAttributes,
  recordAidPlan,
} from "@/instrumentation/aidPlanTelemetry";
import type { TiltakspakkeContext } from "@/schema/tiltakspakkeContext";
import { ferdigstillPlanServerAction } from "@/server/actions/ferdigstillPlan";
import type { ferdigstillPlanActionPayloadSchema } from "@/server/actions/serverActionsInputValidation";
import type { FetchUpdateResult } from "@/server/tokenXFetch/FetchResult";

export type FerdigstillPlanActionPayload = z.infer<
  typeof ferdigstillPlanActionPayloadSchema
>;

type Submission = {
  narmesteLederId: string;
  payload: FerdigstillPlanActionPayload;
  attributes: ReturnType<typeof getAidPlanAttributes>;
};

export default function useFerdigstillOppfolgingsplanAction(
  tiltakspakke: TiltakspakkeContext,
) {
  const { narmesteLederId } = useParams<{ narmesteLederId: string }>();
  const { push } = useRouter();
  const submitted = useRef(false);

  const initialFerdigstillState = { error: null };

  const [{ error }, ferdigstillPlanAction, isPendingFerdigstillPlan] =
    useActionState(innerFerdigstillPlanAction, initialFerdigstillState);

  async function innerFerdigstillPlanAction(
    _previousState: FetchUpdateResult,
    submission: Submission,
  ): Promise<FetchUpdateResult> {
    const { attributes, narmesteLederId, payload } = submission;
    recordAidPlan({ ...attributes, hendelse: "opprett", utfall: "forsok" });
    let result: FetchUpdateResult;
    try {
      result = await ferdigstillPlanServerAction(narmesteLederId, payload);
    } catch (error) {
      submitted.current = false;
      recordAidPlan({ ...attributes, hendelse: "opprett", utfall: "feilet" });
      throw error;
    }
    if (result.error) {
      submitted.current = false;
      recordAidPlan({ ...attributes, hendelse: "opprett", utfall: "feilet" });
      return result;
    }

    recordAidPlan({ ...attributes, hendelse: "opprett", utfall: "bekreftet" });
    push(getAGAktivPlanNyligOpprettetHref(narmesteLederId));
    return result;
  }

  function startFerdigstillPlanAction(payload: FerdigstillPlanActionPayload) {
    // React action queues allow repeated dispatches. Lock synchronously and
    // keep the lock after success until navigation unmounts the wizard.
    if (submitted.current) return;
    submitted.current = true;
    const submission = {
      narmesteLederId,
      payload,
      attributes: getAidPlanAttributes(tiltakspakke),
    };
    startTransition(() => {
      ferdigstillPlanAction(submission);
    });
  }

  return {
    startFerdigstillPlanAction,
    isPendingFerdigstillPlan,
    error,
  };
}
