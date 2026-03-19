"use client";

import { Alert, BodyLong, Modal, VStack } from "@navikt/ds-react";
import { useParams, useRouter } from "next/navigation";
import { startTransition, useActionState } from "react";
import { knappKlikket } from "@/common/analytics/events-and-properties/knappKlikket-properties";
import { logAnalyticsEvent } from "@/common/analytics/logAnalyticsEvent";
import { getAGOpprettNyPlanHref } from "@/common/route-hrefs";
import { slettUtkastAndRedirectToNyPlanServerAction } from "@/server/actions/slettUtkast";
import { upsertUtkastWithAktivPlanServerAction } from "@/server/actions/upsertUtkastWithAktivPlan";
import { FetchErrorAlert } from "@/ui/FetchErrorAlert";
import { TrackedButton } from "@/ui/TrackedButton";

interface Props {
  ref: React.RefObject<HTMLDialogElement | null>;
  hasUtkast: boolean;
}

export function LagNyPlanModal({ ref, hasUtkast }: Props) {
  const router = useRouter();
  const { narmesteLederId } = useParams<{ narmesteLederId: string }>();

  const [{ error: upsertError }, upsertUtkastAction, isPendingUpsert] =
    useActionState(upsertUtkastWithAktivPlanServerAction, { error: null });
  const [{ error: slettError }, slettUtkastAction, isPendingSlett] =
    useActionState(slettUtkastAndRedirectToNyPlanServerAction, { error: null });

  const isPending = isPendingUpsert || isPendingSlett;

  function handleBegynnMedTomPlanClick() {
    if (hasUtkast) {
      startTransition(() => {
        slettUtkastAction(narmesteLederId);
      });
      return;
    }

    router.push(getAGOpprettNyPlanHref(narmesteLederId));
  }

  return (
    <Modal
      ref={ref}
      header={{
        heading: "Lag ny oppfølgingsplan",
      }}
      closeOnBackdropClick
      onClose={() => {
        logAnalyticsEvent({
          name: "knapp klikket",
          properties: {
            ...knappKlikket.aktivPlanSide.lagNyPlanModal.avbryt,
          },
        });
      }}
    >
      <Modal.Body>
        <VStack gap="space-16">
          <BodyLong>
            Du kan lage en ny oppfølgingsplan med utgangspunkt i den forrige
            planen du lagde.
          </BodyLong>

          {hasUtkast && (
            <Alert variant="warning">
              Du har allerede et påbegynt utkast. Hvis du fortsetter, vil det
              eksisterende utkastet bli erstattet.
            </Alert>
          )}

          <FetchErrorAlert error={upsertError ?? slettError} />
        </VStack>
      </Modal.Body>

      <Modal.Footer>
        <form action={() => upsertUtkastAction(narmesteLederId)}>
          <TrackedButton
            type="submit"
            variant="primary"
            loading={isPendingUpsert}
            disabled={isPending}
            tracking={
              knappKlikket.aktivPlanSide.lagNyPlanModal
                .begynnMedInnholdFraForrigePlan
            }
          >
            Begynn med innhold fra forrige plan
          </TrackedButton>
        </form>

        <TrackedButton
          variant="secondary"
          onClick={handleBegynnMedTomPlanClick}
          loading={isPendingSlett}
          disabled={isPending}
          tracking={knappKlikket.aktivPlanSide.lagNyPlanModal.begynnMedTomPlan}
        >
          Begynn med tom plan
        </TrackedButton>
      </Modal.Footer>
    </Modal>
  );
}
