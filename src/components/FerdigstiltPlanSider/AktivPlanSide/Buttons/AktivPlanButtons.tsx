"use client";

import { startTransition, useActionState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { HStack } from "@navikt/ds-react";
import { knappKlikket } from "@/common/analytics/events-and-properties/knappKlikket-properties";
import { getAGOpprettNyPlanHref } from "@/common/route-hrefs";
import { upsertUtkastWithAktivPlanServerAction } from "@/server/actions/upsertUtkastWithAktivPlan";
import { FetchErrorAlert } from "@/ui/FetchErrorAlert";
import { TrackedButton } from "@/ui/TrackedButton";
import { VilDuOverskriveUtkastForAEndrePlanModal } from "../HarAlleredeUtkastModaler/VilDuOverskriveUtkastForAEndrePlanModal";
import { VilDuSletteUtkastForALageNyPlanModal } from "../HarAlleredeUtkastModaler/VilDuSletteUtkastForALageNyPlanModal";
import { VisPdfButtonAG } from "./VisPdfButtonAG";

interface Props {
  planId: string;
  hasUtkast: boolean;
  userHasEditAccess: boolean;
}

export function AktivPlanButtons({
  planId,
  userHasEditAccess,
  hasUtkast,
}: Props) {
  const { push } = useRouter();
  const { narmesteLederId } = useParams<{ narmesteLederId: string }>();

  const vilDuOverskriveUtkastMedInnholdFraAktivPlanModalRef =
    useRef<HTMLDialogElement | null>(null);
  const vilDuSletteUtkastForALageNyPlanModalRef =
    useRef<HTMLDialogElement | null>(null);

  const [
    { error: upsertUtkastWithAktivPlanError },
    upsertUtkastWithAktivPlanAction,
    isPendingUpsertUtkastWithAktivPlan,
  ] = useActionState(upsertUtkastWithAktivPlanServerAction, {
    error: null,
  });

  function handleEndreOppfolgingsplanClick() {
    if (hasUtkast) {
      vilDuOverskriveUtkastMedInnholdFraAktivPlanModalRef.current?.showModal();
    } else {
      startTransition(() => {
        upsertUtkastWithAktivPlanAction(narmesteLederId);
      });
    }
  }

  function handleNyPlanClick() {
    if (hasUtkast) {
      vilDuSletteUtkastForALageNyPlanModalRef.current?.showModal();
    } else {
      push(getAGOpprettNyPlanHref(narmesteLederId));
    }
  }

  return (
    <>
      <VilDuOverskriveUtkastForAEndrePlanModal
        ref={vilDuOverskriveUtkastMedInnholdFraAktivPlanModalRef}
      />
      <VilDuSletteUtkastForALageNyPlanModal
        ref={vilDuSletteUtkastForALageNyPlanModalRef}
      />
      <HStack justify="space-between">
        <HStack gap="space-16">
          <TrackedButton
            disabled={!userHasEditAccess}
            variant="primary"
            onClick={handleEndreOppfolgingsplanClick}
            loading={isPendingUpsertUtkastWithAktivPlan}
            tracking={knappKlikket.aktivPlanSide.endreOppfolgingsplan}
          >
            Endre oppfølgingsplanen
          </TrackedButton>

          <TrackedButton
            variant="secondary"
            onClick={handleNyPlanClick}
            disabled={!userHasEditAccess}
            tracking={knappKlikket.aktivPlanSide.lagNyOppfolgingsplan}
          >
            Lag en ny plan
          </TrackedButton>
        </HStack>

        <VisPdfButtonAG narmesteLederId={narmesteLederId} planId={planId} />
      </HStack>
      <FetchErrorAlert
        error={upsertUtkastWithAktivPlanError}
        className="mt-4"
      />
    </>
  );
}
