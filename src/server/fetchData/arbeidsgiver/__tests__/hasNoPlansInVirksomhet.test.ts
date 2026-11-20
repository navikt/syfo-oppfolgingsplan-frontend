import { expect, test, vi } from "vitest";
import {
  mockOversiktDataEmptyWithAccess,
  mockOversiktDataOnlyActivePlan,
  mockOversiktDataOnlyDraft,
  mockOversiktDataOnlyPreviousPlans,
} from "@/server/fetchData/mockData/mockOversiktDataVariants";
import { fetchOppfolgingsplanOversiktForAG } from "../fetchOppfolgingsplanOversikt";
import { hasNoPlansInVirksomhet } from "../hasNoPlansInVirksomhet";

vi.mock("../fetchOppfolgingsplanOversikt", () => ({
  fetchOppfolgingsplanOversiktForAG: vi.fn(),
}));

test("fails closed when the overview fails", async () => {
  vi.mocked(fetchOppfolgingsplanOversiktForAG).mockResolvedValue({
    error: { type: "FETCH_NETWORK_ERROR" },
    data: null,
  });
  await expect(hasNoPlansInVirksomhet("leader")).resolves.toBe(false);
});

test.each([
  ["active plan", mockOversiktDataOnlyActivePlan, false],
  ["previous plans", mockOversiktDataOnlyPreviousPlans, false],
  ["empty overview", mockOversiktDataEmptyWithAccess, true],
  ["draft only", mockOversiktDataOnlyDraft, true],
] as const)(
  "detects no plans in virksomhet with %s",
  async (_name, data, expected) => {
    vi.mocked(fetchOppfolgingsplanOversiktForAG).mockResolvedValue({
      error: null,
      data,
    });
    await expect(hasNoPlansInVirksomhet("leader")).resolves.toBe(expected);
    expect(fetchOppfolgingsplanOversiktForAG).toHaveBeenLastCalledWith(
      "leader",
    );
  },
);
