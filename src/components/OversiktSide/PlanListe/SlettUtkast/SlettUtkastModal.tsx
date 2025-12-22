import { BodyLong, Modal } from "@navikt/ds-react";
import { FetchErrorAlert } from "@/ui/FetchErrorAlert";
import { TrackedButton } from "@/ui/TrackedButton";
import useSlettUtkastAction from "./useSlettUtkastAction";

interface Props {
  modalRef: React.RefObject<HTMLDialogElement | null>;
}

export function SlettUtkastModal({ modalRef }: Props) {
  const { slettUtkastAction, isPendingSlettUtkast, error } =
    useSlettUtkastAction();

  return (
    <Modal
      ref={modalRef}
      header={{
        heading: "Slett utkast",
        closeButton: false,
      }}
      closeOnBackdropClick
    >
      <Modal.Body>
        <BodyLong>Er du sikker på at du vil slette utkastet ditt?</BodyLong>

        <FetchErrorAlert
          error={error}
          fallbackMessage="Noe gikk galt når vi prøvde å slette utkastet. Vennligst prøv igjen
            senere."
          className="mt-4"
        />
      </Modal.Body>

      <Modal.Footer>
        <form
          action={() =>
            slettUtkastAction({
              onSuccess: () => modalRef.current?.close(),
            })
          }
        >
          <TrackedButton
            type="submit"
            variant="primary"
            loading={isPendingSlettUtkast}
            tracking={{
              komponentId: "slett-utkast-modal-knapp",
              tekst: "Slett utkast",
              kontekst: "OversiktSide",
            }}
          >
            Slett utkast
          </TrackedButton>
        </form>

        <TrackedButton
          variant="secondary"
          onClick={() => {
            modalRef.current?.close();
          }}
          tracking={{
            komponentId: "avbryt-slett-utkast-modal-knapp",
            tekst: "Avbryt",
            kontekst: "OversiktSide",
          }}
        >
          Avbryt
        </TrackedButton>
      </Modal.Footer>
    </Modal>
  );
}
