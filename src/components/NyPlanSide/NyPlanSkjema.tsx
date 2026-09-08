import type { TiltakspakkeContext } from "@/schema/tiltakspakkeContext";
import type { ConvertedLagretUtkastResponse } from "@/schema/utkastResponseSchema";
import type { FerdigstillPlanActionPayload } from "@/server/actions/FerdigstillPlanAction";
import { ferdigstillPlanServerAction } from "@/server/actions/ferdigstillPlan";
import LagPlanVeiviser from "./LagPlanVeiviser";

export default async function NyPlanSkjema({
  narmesteLederId,
  lagretUtkastPromise,
  tiltakspakkePromise,
}: {
  narmesteLederId: string;
  lagretUtkastPromise: Promise<ConvertedLagretUtkastResponse>;
  tiltakspakkePromise: Promise<TiltakspakkeContext>;
}) {
  const tiltakspakke = await tiltakspakkePromise;

  async function ferdigstillAction(payload: FerdigstillPlanActionPayload) {
    "use server";
    // Next protects the server-rendered snapshot in this closure. Neither the
    // leader nor the assignment is accepted as a client-supplied action argument.
    // The backend still authorizes the current user on every submission.
    return ferdigstillPlanServerAction(narmesteLederId, payload, tiltakspakke);
  }

  return (
    <LagPlanVeiviser
      lagretUtkastPromise={lagretUtkastPromise}
      tiltakspakkePromise={tiltakspakkePromise}
      ferdigstillAction={ferdigstillAction}
    />
  );
}
