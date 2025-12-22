"use client";

import { useRef } from "react";
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
        tracking={{
          komponentId: "apne-slett-utkast-modal-knapp",
          tekst: "Slett utkast",
          kontekst: "OversiktSide",
        }}
      >
        Slett utkast
      </TrackedButton>

      <SlettUtkastModal modalRef={modalRef} />
    </>
  );
}
