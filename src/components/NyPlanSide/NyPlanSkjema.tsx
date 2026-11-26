import type { TiltakspakkeContext } from "@/schema/tiltakspakkeContext";
import type { ConvertedLagretUtkastResponse } from "@/schema/utkastResponseSchema";
import type { FerdigstillPlanActionPayload } from "@/server/actions/FerdigstillPlanAction";
import { ferdigstillPlanServerAction } from "@/server/actions/ferdigstillPlan";
import LagPlanVeiviser from "./LagPlanVeiviser";

export default async function NyPlanSkjema({
  narmesteLederId,
  lagretUtkastPromise,
  tiltakspakkePromise,
  hasNoPlansInVirksomhetPromise,
}: {
  narmesteLederId: string;
  lagretUtkastPromise: Promise<ConvertedLagretUtkastResponse>;
  tiltakspakkePromise: Promise<TiltakspakkeContext>;
  hasNoPlansInVirksomhetPromise: Promise<boolean>;
}) {
  const tiltakspakke = await tiltakspakkePromise;
  const showDialogmoteInfo =
    tiltakspakke.isDialogmoteTiltakspakkeActive &&
    (await hasNoPlansInVirksomhetPromise);

  async function ferdigstillAction(payload: FerdigstillPlanActionPayload) {
    "use server";
    // Next protects the server-rendered leader in this closure, so it is not
    // accepted as a client-supplied action argument. The backend still
    // authorizes the current user on every submission.
    return ferdigstillPlanServerAction(narmesteLederId, payload);
  }

  return (
    <LagPlanVeiviser
      lagretUtkastPromise={lagretUtkastPromise}
      tiltakspakkePromise={tiltakspakkePromise}
      ferdigstillAction={ferdigstillAction}
      showDialogmoteInfo={showDialogmoteInfo}
    />
  );
}
