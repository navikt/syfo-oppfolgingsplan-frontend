import { useActionState } from "react";
import { useParams } from "next/navigation";
import { Alert, BodyLong, Button, Modal } from "@navikt/ds-react";
import { overskrivUtkastMedInnholdFraAktivPlanServerAction } from "@/server/actions/overskrivUtkastMedInnholdFraAktivPlan";
import { getGeneralActionErrorMessage } from "@/utils/error-messages";

interface Props {
  ref: React.RefObject<HTMLDialogElement | null>;
}

export function OverskrivUtkastModal({ ref }: Props) {
  const { narmesteLederId } = useParams<{ narmesteLederId: string }>();

  const [result, overskrivUtkastAction, isPendingOverskrivUtkast] =
    useActionState(overskrivUtkastMedInnholdFraAktivPlanServerAction, {
      success: true,
      data: undefined,
    });

  return (
    <Modal
      ref={ref}
      header={{
        heading: "Slett utkast?",
        closeButton: false,
      }}
      closeOnBackdropClick
    >
      <Modal.Body>
        <BodyLong>
          Du har allerede et utkast. Hvis du fortsetter vil utkastet ditt bli
          erstattet med innholdet i denne planen. Vil du fortsette?
        </BodyLong>

        {!result.success && (
          <Alert variant="error">
            {getGeneralActionErrorMessage(
              result.error,
              "Beklager, noe gikk galt.",
            )}
          </Alert>
        )}
      </Modal.Body>

      <Modal.Footer>
        <form action={() => overskrivUtkastAction(narmesteLederId)}>
          <Button
            type="submit"
            variant="primary"
            loading={isPendingOverskrivUtkast}
          >
            Erstatt utkast og fortsett
          </Button>
        </form>

        <Button variant="secondary" onClick={() => ref.current?.close()}>
          Behold utkastet mitt
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
