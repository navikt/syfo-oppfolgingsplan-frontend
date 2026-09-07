import { cleanup, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { recordAidPlan } from "@/instrumentation/aidPlanTelemetry";
import { ferdigstillPlanServerAction } from "@/server/actions/ferdigstillPlan";
import { mockUtfyltLagretUtkastResponse } from "@/server/fetchData/mockData/mockUtkastData";
import { formLabels } from "./form-labels";
import {
  createMockLagretUtkastResponse,
  renderLagPlanVeiviserComponent,
} from "./LagPlanVeiviser.testUtils";

vi.mock("@/server/actions/ferdigstillPlan", () => ({
  ferdigstillPlanServerAction: vi.fn(),
}));
vi.mock("@/instrumentation/aidPlanTelemetry", async (importOriginal) => ({
  ...(await importOriginal<
    typeof import("@/instrumentation/aidPlanTelemetry")
  >()),
  recordAidPlan: vi.fn(),
}));

describe("plan wizard measurement wiring", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(ferdigstillPlanServerAction).mockResolvedValue({ error: null });
  });
  afterEach(cleanup);

  test("does not count an invalid form as a creation attempt", async () => {
    await renderLagPlanVeiviserComponent(
      createMockLagretUtkastResponse(),
      true,
    );
    await userEvent.click(
      screen.getByRole("button", { name: /gå til oppsummering/i }),
    );
    expect(ferdigstillPlanServerAction).not.toHaveBeenCalled();
    expect(
      vi.mocked(recordAidPlan).mock.calls.map(([event]) => event.hendelse),
    ).toEqual(["beslutning"]);
  });

  test.each([
    { aid: false, reminder: "Nei" },
    { aid: true, reminder: "Ja" },
    { aid: true, reminder: "Nei" },
  ] as const)("records submitted preference at creation, not draft or summary: %j", async ({
    aid,
    reminder,
  }) => {
    await renderLagPlanVeiviserComponent(mockUtfyltLagretUtkastResponse, aid);
    if (aid) {
      const reminderGroup = screen.getByRole("radiogroup", {
        name: formLabels.evalueringPaaminnelse.label,
      });
      await userEvent.click(
        within(reminderGroup).getByRole("radio", { name: reminder }),
      );
    }
    await userEvent.click(
      screen.getByRole("button", { name: /gå til oppsummering/i }),
    );
    await screen.findByRole("heading", { name: "Oppsummering" });
    expect(
      vi.mocked(recordAidPlan).mock.calls.map(([event]) => event.hendelse),
    ).toEqual(["beslutning"]);
    await userEvent.click(
      screen.getByRole("button", {
        name: "Ferdigstill og del med den ansatte",
      }),
    );
    await waitFor(() =>
      expect(recordAidPlan).toHaveBeenLastCalledWith({
        gruppe: aid ? "tiltak" : "kontroll",
        variant: aid ? "aid" : "standard",
        hendelse: "opprett",
        utfall: "bekreftet",
        evaluering_paaminnelse: reminder === "Ja" ? "ja" : "nei",
      }),
    );
    expect(ferdigstillPlanServerAction).toHaveBeenCalledOnce();
    expect(ferdigstillPlanServerAction).toHaveBeenCalledWith(
      "12345",
      expect.objectContaining({ evalueringPaaminnelse: reminder === "Ja" }),
    );
    expect(
      vi.mocked(recordAidPlan).mock.calls.map(([event]) => event.utfall),
    ).toEqual(["tilgjengelig", "forsok", "bekreftet"]);
  });
});
