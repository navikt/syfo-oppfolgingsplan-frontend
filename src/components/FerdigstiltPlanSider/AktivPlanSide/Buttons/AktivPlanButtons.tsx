"use client";

import { startTransition, useActionState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { HStack } from "@navikt/ds-react";
import { getAGOpprettNyPlanHref } from "@/common/route-hrefs";
import { upsertUtkastWithAktivPlanServerAction } from "@/server/actions/upsertUtkastWithAktivPlanServerAction";
import { FetchErrorAlert } from "@/ui/FetchErrorAlert";
import { TrackedButton } from "@/ui/TrackedButton";
import { LastNedSomPdfButton } from "../../Shared/Buttons/LastNedSomPdfButton";
import { VilDuOverskriveUtkastModal } from "../AlleredeUtkastModaler/VilDuOverskriveUtkastMedInnholdModal";
import { VilDuSletteUtkastModal } from "../AlleredeUtkastModaler/VilDuSletteUtkastModal";

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

  const vilDuOverskriveUtkastModal = useRef<HTMLDialogElement | null>(null);
  const vilDuSletteUtkastModal = useRef<HTMLDialogElement | null>(null);

  const [
    { error: upsertUtkastWithAktivPlanError },
    upsertUtkastWithAktivPlanAction,
    isPendingUpsertUtkastWithAktivPlan,
  ] = useActionState(upsertUtkastWithAktivPlanServerAction, {
    error: null,
  });

  function handleEndreOppfolgingsplanClick() {
    if (hasUtkast) {
      vilDuOverskriveUtkastModal.current?.showModal();
    } else {
      startTransition(() => {
        upsertUtkastWithAktivPlanAction(narmesteLederId);
      });
    }
  }

  function handleNyPlanClick() {
    if (hasUtkast) {
      vilDuSletteUtkastModal.current?.showModal();
    } else {
      push(getAGOpprettNyPlanHref(narmesteLederId));
    }
  }

  return (
    <>
      <VilDuOverskriveUtkastModal ref={vilDuOverskriveUtkastModal} />
      <VilDuSletteUtkastModal ref={vilDuSletteUtkastModal} />

      <HStack justify="space-between">
        <HStack gap="4">
          <TrackedButton
            disabled={!userHasEditAccess}
            variant="primary"
            onClick={handleEndreOppfolgingsplanClick}
            loading={isPendingUpsertUtkastWithAktivPlan}
            tracking={{
              komponentId: "endre-oppfolgingsplan-knapp",
              tekst: "Endre oppfølgingsplanen",
              kontekst: "AktivPlanSide",
            }}
          >
            Endre oppfølgingsplanen
          </TrackedButton>

          <TrackedButton
            variant="secondary"
            onClick={handleNyPlanClick}
            disabled={!userHasEditAccess}
            tracking={{
              komponentId: "lag-ny-oppfolgingsplan-knapp",
              tekst: "Lag en ny plan",
              kontekst: "AktivPlanSide",
            }}
          >
            Lag en ny plan
          </TrackedButton>
        </HStack>

        <LastNedSomPdfButton
          narmesteLederId={narmesteLederId}
          planId={planId}
        />
      </HStack>

      <FetchErrorAlert
        error={upsertUtkastWithAktivPlanError}
        className="mt-4"
      />
    </>
  );
}
