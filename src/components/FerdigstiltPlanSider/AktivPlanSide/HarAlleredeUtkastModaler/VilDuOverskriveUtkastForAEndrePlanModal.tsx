import { useActionState } from "react";
import { useParams } from "next/navigation";
import { BodyLong, Modal } from "@navikt/ds-react";
import { knappKlikket } from "@/common/analytics/events-and-properties/knappKlikket-properties";
import { upsertUtkastWithAktivPlanServerAction } from "@/server/actions/upsertUtkastWithAktivPlan";
import { FetchErrorAlert } from "@/ui/FetchErrorAlert";
import { TrackedButton } from "@/ui/TrackedButton";

interface Props {
  ref: React.RefObject<HTMLDialogElement | null>;
}

export function VilDuOverskriveUtkastForAEndrePlanModal({ ref }: Props) {
  const { narmesteLederId } = useParams<{ narmesteLederId: string }>();

  const [{ error }, overskrivUtkastAction, isPendingOverskrivUtkast] =
    useActionState(upsertUtkastWithAktivPlanServerAction, {
      error: null,
    });

  return (
    <Modal
      ref={ref}
      header={{
        heading: "Erstatt utkast?",
      }}
      closeOnBackdropClick
    >
      <Modal.Body>
        <BodyLong>
          Du har allerede et utkast. Hvis du fortsetter vil utkastet ditt bli
          erstattet med innholdet i denne planen. Vil du fortsette?
        </BodyLong>

        <FetchErrorAlert error={error} className="mt-4" />
      </Modal.Body>

      <Modal.Footer>
        <form action={() => overskrivUtkastAction(narmesteLederId)}>
          <TrackedButton
            type="submit"
            variant="primary"
            loading={isPendingOverskrivUtkast}
            tracking={
              knappKlikket.aktivPlanSide.overskriveUtkastForAEndreModal.bekreft
            }
          >
            Erstatt utkast og fortsett
          </TrackedButton>
        </form>

        <TrackedButton
          variant="secondary"
          onClick={() => ref.current?.close()}
          tracking={
            knappKlikket.aktivPlanSide.overskriveUtkastForAEndreModal.avbryt
          }
        >
          Avbryt
        </TrackedButton>
      </Modal.Footer>
    </Modal>
  );
}
