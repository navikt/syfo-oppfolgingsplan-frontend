import { useParams, useRouter } from "next/navigation";
import { startTransition, useActionState, useEffect, useRef } from "react";
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
  attributes: ReturnType<typeof getAidPlanAttributes> & {
    evaluering_paaminnelse: "ja" | "nei";
  };
};

type SubmissionResult = FetchUpdateResult & {
  completedSubmission: Submission | null;
};

export default function useFerdigstillOppfolgingsplanAction(
  tiltakspakke: TiltakspakkeContext,
) {
  const { narmesteLederId } = useParams<{ narmesteLederId: string }>();
  const { push } = useRouter();
  const activeSubmission = useRef<Submission | null>(null);

  useEffect(() => {
    return () => {
      // A save may finish after the user leaves. Keep its telemetry, but do not
      // let its response navigate a different or newly mounted wizard.
      if (activeSubmission.current?.narmesteLederId === narmesteLederId) {
        activeSubmission.current = null;
      }
    };
  }, [narmesteLederId]);

  const initialFerdigstillState: SubmissionResult = {
    error: null,
    completedSubmission: null,
  };

  const [
    { error, completedSubmission },
    ferdigstillPlanAction,
    isPendingFerdigstillPlan,
  ] = useActionState(innerFerdigstillPlanAction, initialFerdigstillState);

  useEffect(() => {
    // Wait for React to commit the result. A newer, still-loading navigation
    // may keep this wizard mounted after the save has already finished.
    if (
      completedSubmission &&
      activeSubmission.current === completedSubmission
    ) {
      push(
        getAGAktivPlanNyligOpprettetHref(completedSubmission.narmesteLederId),
      );
    }
  }, [completedSubmission, push]);

  async function innerFerdigstillPlanAction(
    _previousState: SubmissionResult,
    submission: Submission,
  ): Promise<SubmissionResult> {
    const { attributes, narmesteLederId, payload } = submission;
    recordAidPlan({ ...attributes, hendelse: "opprett", utfall: "forsok" });
    let result: FetchUpdateResult;
    try {
      result = await ferdigstillPlanServerAction(narmesteLederId, payload);
    } catch (error) {
      if (activeSubmission.current === submission) {
        activeSubmission.current = null;
      }
      recordAidPlan({ ...attributes, hendelse: "opprett", utfall: "feilet" });
      throw error;
    }
    if (result.error) {
      if (activeSubmission.current === submission) {
        activeSubmission.current = null;
      }
      recordAidPlan({ ...attributes, hendelse: "opprett", utfall: "feilet" });
      return { ...result, completedSubmission: null };
    }

    recordAidPlan({ ...attributes, hendelse: "opprett", utfall: "bekreftet" });
    return { ...result, completedSubmission: submission };
  }

  function startFerdigstillPlanAction(payload: FerdigstillPlanActionPayload) {
    // React action queues allow repeated dispatches. Lock synchronously and
    // keep the lock after success until navigation unmounts the wizard.
    if (activeSubmission.current) return;
    const submission: Submission = {
      narmesteLederId,
      payload,
      attributes: {
        ...getAidPlanAttributes(tiltakspakke),
        evaluering_paaminnelse: payload.evalueringPaaminnelse ? "ja" : "nei",
      },
    };
    activeSubmission.current = submission;
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
