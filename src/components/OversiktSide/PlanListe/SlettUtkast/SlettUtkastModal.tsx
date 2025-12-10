import { Alert, BodyLong, Button, Modal } from "@navikt/ds-react";
import { getGeneralActionErrorMessage } from "@/utils/error-messages";
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

        {error && (
          <div className="mb-4">
            <Alert variant="error">
              {getGeneralActionErrorMessage(
                error,
                "Vi klarte ikke å slette utkastet. Vennligst prøv igjen senere.",
              )}
            </Alert>
          </div>
        )}
      </Modal.Body>

      <Modal.Footer>
        <form
          action={() =>
            slettUtkastAction({
              onSuccess: () => modalRef.current?.close(),
            })
          }
        >
          <Button
            type="submit"
            variant="primary"
            loading={isPendingSlettUtkast}
          >
            Slett utkast
          </Button>
        </form>

        <Button variant="secondary" onClick={() => modalRef.current?.close()}>
          Avbryt
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
