import { BodyLong, Modal } from "@navikt/ds-react";
import { useParams } from "next/navigation";
import { useActionState } from "react";
import { knappKlikket } from "@/common/analytics/events-and-properties/knappKlikket-properties";
import { slettUtkastAndRedirectToNyPlanServerAction } from "@/server/actions/slettUtkast";
import { FetchErrorAlert } from "@/ui/FetchErrorAlert";
import { TrackedButton } from "@/ui/TrackedButton";

interface Props {
  ref: React.RefObject<HTMLDialogElement | null>;
}

export function VilDuSletteUtkastForALageNyPlanModal({ ref }: Props) {
  const { narmesteLederId } = useParams<{ narmesteLederId: string }>();

  const [{ error }, slettUtkastAndRedirectAction, isPendingSlettUtkast] =
    useActionState(slettUtkastAndRedirectToNyPlanServerAction, {
      error: null,
    });

  return (
    <Modal
      ref={ref}
      header={{
        heading: "Slett utkast?",
      }}
      closeOnBackdropClick
    >
      <Modal.Body>
        <BodyLong>
          Du har allerede et utkast. Hvis du fortsetter vil utkastet ditt bli
          slettet. Vil du fortsette?
        </BodyLong>

        <FetchErrorAlert error={error} className="mt-4" />
      </Modal.Body>

      <Modal.Footer>
        <form action={() => slettUtkastAndRedirectAction(narmesteLederId)}>
          <TrackedButton
            type="submit"
            variant="primary"
            loading={isPendingSlettUtkast}
            tracking={
              knappKlikket.aktivPlanSide.sletteUtkastForALageNyModal.bekreft
            }
          >
            Slett utkast og fortsett
          </TrackedButton>
        </form>

        <TrackedButton
          variant="secondary"
          onClick={() => {
            ref.current?.close();
          }}
          tracking={
            knappKlikket.aktivPlanSide.sletteUtkastForALageNyModal.avbryt
          }
        >
          Avbryt
        </TrackedButton>
      </Modal.Footer>
    </Modal>
  );
}
