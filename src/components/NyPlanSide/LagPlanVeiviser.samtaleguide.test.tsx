import { cleanup, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, expect, test } from "vitest";
import {
  createMockLagretUtkastResponse,
  renderLagPlanVeiviserComponent,
} from "./LagPlanVeiviser.testUtils";

afterEach(cleanup);

test("samtaleguiden er tilgjengelig med tastatur for tiltaksgruppen", async () => {
  await renderLagPlanVeiviserComponent(createMockLagretUtkastResponse(), true);

  const link = screen.getByRole("link", {
    name: /samtaleguiden/i,
  });
  await userEvent.tab();
  expect(link).toHaveFocus();
});

test("viser ikke det nye kortet for kontrollgruppen", async () => {
  await renderLagPlanVeiviserComponent(createMockLagretUtkastResponse(), false);

  expect(
    screen.queryByRole("link", { name: /samtaleguiden/i }),
  ).not.toBeInTheDocument();
});
