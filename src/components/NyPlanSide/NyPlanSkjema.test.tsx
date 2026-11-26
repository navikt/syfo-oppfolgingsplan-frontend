import { beforeEach, expect, test, vi } from "vitest";
import type { TiltakspakkeContext } from "@/schema/tiltakspakkeContext";
import type { FerdigstillPlanActionPayload } from "@/server/actions/FerdigstillPlanAction";
import { ferdigstillPlanServerAction } from "@/server/actions/ferdigstillPlan";
import { mockUtfyltLagretUtkastResponse } from "@/server/fetchData/mockData/mockUtkastData";
import NyPlanSkjema from "./NyPlanSkjema";

vi.mock("@/server/actions/ferdigstillPlan", () => ({
  ferdigstillPlanServerAction: vi.fn(),
}));

beforeEach(() => vi.clearAllMocks());

test("binds saving to the leader of each form, including an older open form", async () => {
  const tiltakspakke: TiltakspakkeContext = {
    isDialogmoteTiltakspakkeActive: false,
  };
  const first = await NyPlanSkjema({
    narmesteLederId: "first-leader",
    lagretUtkastPromise: Promise.resolve(mockUtfyltLagretUtkastResponse),
    tiltakspakkePromise: Promise.resolve(tiltakspakke),
    hasNoPlansInVirksomhetPromise: Promise.resolve(false),
  });
  const second = await NyPlanSkjema({
    narmesteLederId: "second-leader",
    lagretUtkastPromise: Promise.resolve(mockUtfyltLagretUtkastResponse),
    tiltakspakkePromise: Promise.resolve(tiltakspakke),
    hasNoPlansInVirksomhetPromise: Promise.resolve(false),
  });
  // The wrapper delegates payload validation and authorization to the save path.
  // Extra client fields cannot replace the closed-over leader.
  const payload = {
    narmesteLederId: "other-leader",
  } as unknown as FerdigstillPlanActionPayload;
  await first.props.ferdigstillAction(payload);
  await second.props.ferdigstillAction(payload);
  expect(ferdigstillPlanServerAction).toHaveBeenNthCalledWith(
    1,
    "first-leader",
    payload,
  );
  expect(ferdigstillPlanServerAction).toHaveBeenNthCalledWith(
    2,
    "second-leader",
    payload,
  );
});
