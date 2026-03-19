"use client";

import { Alert, BodyLong, Modal, VStack } from "@navikt/ds-react";
import { useParams, useRouter } from "next/navigation";
import { startTransition, useActionState, useState, useTransition } from "react";
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
  const [lastAction, setLastAction] = useState<"upsert" | "slett" | null>(null);
  const [isPendingPush, startPushTransition] = useTransition();

  const [{ error: upsertError }, upsertUtkastAction, isPendingUpsert] =
    useActionState(upsertUtkastWithAktivPlanServerAction, { error: null });
  const [{ error: slettError }, slettUtkastAction, isPendingSlett] =
    useActionState(slettUtkastAndRedirectToNyPlanServerAction, { error: null });

  const isPending = isPendingUpsert || isPendingSlett || isPendingPush;

  const error =
    lastAction === "upsert"
      ? upsertError
      : lastAction === "slett"
        ? slettError
        : null;

  function handleBegynnMedTomPlanClick() {
    setLastAction("slett");

    if (hasUtkast) {
      startTransition(() => {
        slettUtkastAction(narmesteLederId);
      });
      return;
    }

    startPushTransition(() => {
      router.push(getAGOpprettNyPlanHref(narmesteLederId));
    });
  }

  return (
    <Modal
      ref={ref}
      header={{
        heading: "Lag ny oppfølgingsplan",
      }}
      closeOnBackdropClick={!isPending}
      onBeforeClose={() => !isPending}
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

          <FetchErrorAlert error={error} />
        </VStack>
      </Modal.Body>

      <Modal.Footer>
        <TrackedButton
          variant="secondary"
          onClick={handleBegynnMedTomPlanClick}
          loading={hasUtkast ? isPendingSlett : isPendingPush}
          disabled={isPending}
          tracking={knappKlikket.aktivPlanSide.lagNyPlanModal.begynnMedTomPlan}
        >
          Begynn med tom plan
        </TrackedButton>

        <form
          action={() => {
            setLastAction("upsert");
            upsertUtkastAction(narmesteLederId);
          }}
        >
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
      </Modal.Footer>
    </Modal>
  );
}
