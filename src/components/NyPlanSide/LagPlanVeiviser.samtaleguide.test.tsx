import { cleanup, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, expect, test } from "vitest";
import {
  createMockLagretUtkastResponse,
  renderLagPlanVeiviserComponent,
} from "./LagPlanVeiviser.testUtils";

afterEach(cleanup);

test("samtaleguiden er tilgjengelig med tastatur", async () => {
  await renderLagPlanVeiviserComponent(createMockLagretUtkastResponse());

  const link = screen.getByRole("link", {
    name: /samtaleguiden/i,
  });
  await userEvent.tab();
  expect(link).toHaveFocus();
});
