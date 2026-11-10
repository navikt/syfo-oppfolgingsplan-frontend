import { expect, test, vi } from "vitest";
import {
  mockOversiktDataEmptyWithAccess,
  mockOversiktDataOnlyActivePlan,
  mockOversiktDataOnlyDraft,
  mockOversiktDataOnlyPreviousPlans,
} from "@/server/fetchData/mockData/mockOversiktDataVariants";
import { fetchOppfolgingsplanOversiktForAG } from "../fetchOppfolgingsplanOversikt";
import { isFirstPlan } from "../isFirstPlan";

vi.mock("../fetchOppfolgingsplanOversikt", () => ({
  fetchOppfolgingsplanOversiktForAG: vi.fn(),
}));

test("fails closed when the overview fails", async () => {
  vi.mocked(fetchOppfolgingsplanOversiktForAG).mockResolvedValue({
    error: { type: "FETCH_NETWORK_ERROR" },
    data: null,
  });
  await expect(isFirstPlan("leader")).resolves.toBe(false);
});

test.each([
  ["active plan", mockOversiktDataOnlyActivePlan, false],
  ["previous plans", mockOversiktDataOnlyPreviousPlans, false],
  ["empty overview", mockOversiktDataEmptyWithAccess, true],
  ["draft only", mockOversiktDataOnlyDraft, true],
] as const)("detects first plan with %s", async (_name, data, expected) => {
  vi.mocked(fetchOppfolgingsplanOversiktForAG).mockResolvedValue({
    error: null,
    data,
  });
  await expect(isFirstPlan("leader")).resolves.toBe(expected);
  expect(fetchOppfolgingsplanOversiktForAG).toHaveBeenLastCalledWith("leader");
});
