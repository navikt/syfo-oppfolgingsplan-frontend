import { cleanup, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { ferdigstillPlanServerAction } from "@/server/actions/ferdigstillPlan";
import { mockUtfyltLagretUtkastResponse } from "@/server/fetchData/mockData/mockUtkastData";
import { formLabels } from "./form-labels";
import { renderLagPlanVeiviserComponent } from "./LagPlanVeiviser.testUtils";

vi.mock("@/server/actions/ferdigstillPlan", () => ({
  ferdigstillPlanServerAction: vi.fn(),
}));

describe("ferdigstilling av plan", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(ferdigstillPlanServerAction).mockResolvedValue({ error: null });
  });

  afterEach(cleanup);

  test.each(["Ja", "Nei"] as const)(
    "sender valgt evalueringspåminnelse (%s) til backend",
    async (svar) => {
      await renderLagPlanVeiviserComponent(mockUtfyltLagretUtkastResponse);
      const reminderGroup = screen.getByRole("radiogroup", {
        name: formLabels.evalueringPaaminnelse.label,
      });
      await userEvent.click(
        within(reminderGroup).getByRole("radio", { name: svar }),
      );
      await userEvent.click(
        screen.getByRole("button", { name: /gå til oppsummering/i }),
      );
      await screen.findByRole("heading", { name: "Oppsummering" });
      await userEvent.click(
        screen.getByRole("button", {
          name: "Ferdigstill og del med den ansatte",
        }),
      );

      await waitFor(() =>
        expect(ferdigstillPlanServerAction).toHaveBeenCalledWith(
          "12345",
          expect.objectContaining({ evalueringPaaminnelse: svar === "Ja" }),
        ),
      );
    },
  );
});
