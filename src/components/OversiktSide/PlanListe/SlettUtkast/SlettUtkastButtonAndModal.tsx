"use client";

import { useRef } from "react";
import { knappKlikket } from "@/common/analytics/events-and-properties/knappKlikket-properties";
import { TrackedButton } from "@/ui/TrackedButton";
import { SlettUtkastModal } from "./SlettUtkastModal";

export function SlettUtkastButtonAndModal() {
  const modalRef = useRef<HTMLDialogElement>(null);

  function openModal() {
    modalRef.current?.showModal();
  }

  return (
    <>
      <TrackedButton
        variant="tertiary"
        onClick={openModal}
        className="self-start"
        tracking={knappKlikket.oversiktSide.slettUtkastModalTrigger}
      >
        Slett utkast
      </TrackedButton>

      <SlettUtkastModal modalRef={modalRef} />
    </>
  );
}
