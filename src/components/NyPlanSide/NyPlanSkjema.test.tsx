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

test("uses the same assignment for the form and saving, including an older open form", async () => {
  const original: TiltakspakkeContext = {
    gruppe: "tiltak",
    erITiltaksgruppe: true,
  };
  const current: TiltakspakkeContext = {
    gruppe: "kontroll",
    erITiltaksgruppe: false,
  };
  const first = await NyPlanSkjema({
    narmesteLederId: "first-leader",
    lagretUtkastPromise: Promise.resolve(mockUtfyltLagretUtkastResponse),
    tiltakspakkePromise: Promise.resolve(original),
  });
  const second = await NyPlanSkjema({
    narmesteLederId: "second-leader",
    lagretUtkastPromise: Promise.resolve(mockUtfyltLagretUtkastResponse),
    tiltakspakkePromise: Promise.resolve(current),
  });
  // The wrapper delegates payload validation and authorization to the save path.
  // Extra client fields cannot replace the closed-over context or leader.
  const payload = {
    gruppe: "kontroll",
    narmesteLederId: "other-leader",
  } as unknown as FerdigstillPlanActionPayload;
  await first.props.ferdigstillAction(payload);
  await second.props.ferdigstillAction(payload);
  expect(ferdigstillPlanServerAction).toHaveBeenNthCalledWith(
    1,
    "first-leader",
    payload,
    original,
  );
  expect(ferdigstillPlanServerAction).toHaveBeenNthCalledWith(
    2,
    "second-leader",
    payload,
    current,
  );
  await expect(first.props.tiltakspakkePromise).resolves.toEqual(original);
  await expect(second.props.tiltakspakkePromise).resolves.toEqual(current);
});
