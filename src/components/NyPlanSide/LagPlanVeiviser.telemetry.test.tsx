import { cleanup, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { recordAidPlan } from "@/instrumentation/aidPlanTelemetry";
import { ferdigstillPlanServerAction } from "@/server/actions/ferdigstillPlan";
import { mockUtfyltLagretUtkastResponse } from "@/server/fetchData/mockData/mockUtkastData";
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

  test("records confirmed creation from the actual wizard without measuring draft or summary as success", async () => {
    await renderLagPlanVeiviserComponent(mockUtfyltLagretUtkastResponse, false);
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
        gruppe: "kontroll",
        skjemavariant: "standard",
        hendelse: "opprett",
        utfall: "bekreftet",
      }),
    );
    expect(ferdigstillPlanServerAction).toHaveBeenCalledOnce();
    expect(
      vi.mocked(recordAidPlan).mock.calls.map(([event]) => event.utfall),
    ).toEqual(["tilgjengelig", "forsok", "bekreftet"]);
  });
});
