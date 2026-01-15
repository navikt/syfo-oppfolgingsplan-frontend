import { BodyLong, Modal } from "@navikt/ds-react";
import { knappKlikket } from "@/common/analytics/events-and-properties/knappKlikket-properties";
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
            tracking={knappKlikket.oversiktSide.slettUtkastModal.bekreft}
          >
            Slett utkast
          </TrackedButton>
        </form>

        <TrackedButton
          variant="secondary"
          onClick={() => {
            modalRef.current?.close();
          }}
          tracking={knappKlikket.oversiktSide.slettUtkastModal.avbryt}
        >
          Avbryt
        </TrackedButton>
      </Modal.Footer>
    </Modal>
  );
}
