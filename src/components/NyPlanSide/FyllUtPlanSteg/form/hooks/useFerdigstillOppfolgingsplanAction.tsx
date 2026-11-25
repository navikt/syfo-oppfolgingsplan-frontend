import { useParams, useRouter } from "next/navigation";
import { startTransition, useActionState, useEffect, useRef } from "react";
import { getAGAktivPlanNyligOpprettetHref } from "@/common/route-hrefs";
import type {
  FerdigstillPlanAction,
  FerdigstillPlanActionPayload,
} from "@/server/actions/FerdigstillPlanAction";
import type { FetchUpdateResult } from "@/server/tokenXFetch/FetchResult";

export type { FerdigstillPlanActionPayload } from "@/server/actions/FerdigstillPlanAction";

type Submission = {
  narmesteLederId: string;
  payload: FerdigstillPlanActionPayload;
  ferdigstillAction: FerdigstillPlanAction;
};

type SubmissionResult = FetchUpdateResult & {
  completedSubmission: Submission | null;
};

export default function useFerdigstillOppfolgingsplanAction(
  ferdigstillAction: FerdigstillPlanAction,
) {
  const { narmesteLederId } = useParams<{ narmesteLederId: string }>();
  const { push } = useRouter();
  const activeSubmission = useRef<Submission | null>(null);

  useEffect(() => {
    return () => {
      // A save may finish after the user leaves. Do not let its response
      // navigate a different or newly mounted wizard.
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
    let result: FetchUpdateResult;
    try {
      result = await submission.ferdigstillAction(submission.payload);
    } catch (error) {
      if (activeSubmission.current === submission) {
        activeSubmission.current = null;
      }
      throw error;
    }
    if (result.error) {
      if (activeSubmission.current === submission) {
        activeSubmission.current = null;
      }
      return { ...result, completedSubmission: null };
    }

    return { ...result, completedSubmission: submission };
  }

  function startFerdigstillPlanAction(payload: FerdigstillPlanActionPayload) {
    // React action queues allow repeated dispatches. Lock synchronously and
    // keep the lock after success until navigation unmounts the wizard.
    if (activeSubmission.current) return;
    const submission: Submission = {
      narmesteLederId,
      payload,
      ferdigstillAction,
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
