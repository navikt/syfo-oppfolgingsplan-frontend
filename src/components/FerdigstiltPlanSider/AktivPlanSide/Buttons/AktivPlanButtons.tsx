"use client";

import { useRef } from "react";
import NextLink from "next/link";
import { useParams } from "next/navigation";
import { Button, HStack } from "@navikt/ds-react";
import { getAGOpprettNyPlanHref } from "@/common/route-hrefs";
import { LastNedSomPdfButton } from "../../Shared/Buttons/LastNedSomPdfButton";
import { SlettUtkastVedOppdaterPlanModal } from "./SlettUtkastVedOppdaterPlanModal";

export function AktivPlanButtons() {
  const { narmesteLederId } = useParams<{ narmesteLederId: string }>();
  const modalRef = useRef<HTMLDialogElement | null>(null);

  return (
    <>
      <SlettUtkastVedOppdaterPlanModal ref={modalRef} />

      <HStack justify="space-between">
        <HStack gap="4">
          <Button
            variant="primary"
            onClick={() => modalRef.current?.showModal()}
          >
            Endre oppfølgingsplanen
          </Button>

          <Button
            variant="secondary"
            as={NextLink}
            href={getAGOpprettNyPlanHref(narmesteLederId)}
          >
            Lag en ny plan
          </Button>
        </HStack>

        <LastNedSomPdfButton />
      </HStack>
    </>
  );
}
