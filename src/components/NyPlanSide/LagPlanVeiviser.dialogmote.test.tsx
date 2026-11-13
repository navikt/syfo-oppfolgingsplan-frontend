import { cleanup, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, expect, test } from "vitest";
import { formLabels, tiltakspakke2Labels } from "./form-labels";
import {
  createMockLagretUtkastResponse,
  renderLagPlanVeiviserComponent,
} from "./LagPlanVeiviser.testUtils";

afterEach(cleanup);

test.each([
  [false, true],
  [true, true],
  [true, false],
])(
  "date guidance with package 2 active=%s and first plan=%s",
  async (isDialogmoteTiltakspakkeActive, isFirstPlan) => {
    const user = userEvent.setup();
    await renderLagPlanVeiviserComponent(
      createMockLagretUtkastResponse(),
      true,
      { isDialogmoteTiltakspakkeActive, isFirstPlan },
    );

    const description = isDialogmoteTiltakspakkeActive
      ? tiltakspakke2Labels.evalueringsDato.description
      : formLabels.evalueringsDato.description;
    const input = screen.getByRole("textbox", {
      name: formLabels.evalueringsDato.label,
    });
    expect(screen.getByText(description)).toBeVisible();
    expect(
      screen.getByRole("radiogroup", {
        name: formLabels.evalueringPaaminnelse.label,
      }),
    ).toBeVisible();

    const message = document.getElementById("evalueringsDato-info");
    if (isDialogmoteTiltakspakkeActive && isFirstPlan) {
      expect(message).toBeVisible();
      expect(
        screen.getByText(tiltakspakke2Labels.evalueringsDato.infoMessage),
      ).toBeVisible();
      expect(message).toHaveAttribute("id", "evalueringsDato-info");
      expect(input.getAttribute("aria-describedby")?.split(" ")).toContain(
        "evalueringsDato-info",
      );
      expect(input).toHaveAccessibleDescription(
        expect.stringContaining(
          tiltakspakke2Labels.evalueringsDato.infoMessage,
        ),
      );
      expect(input).toHaveAccessibleDescription(
        expect.stringContaining(description),
      );

      // The message must not replace Aksel's description or validation error.
      await user.click(
        screen.getByRole("button", { name: /gå til oppsummering/i }),
      );
      expect(input).toHaveAttribute("aria-invalid", "true");
      const describedBy = input.getAttribute("aria-describedby")?.split(" ");
      expect(describedBy).toContain(message?.id);
      expect(describedBy).toContain(screen.getByText(description).id);
      expect(describedBy).toHaveLength(3);
      const errorId = describedBy?.find(
        (id) => id !== message?.id && id !== screen.getByText(description).id,
      );
      expect(document.getElementById(errorId ?? "")).not.toBeEmptyDOMElement();
    } else {
      expect(message).not.toBeInTheDocument();
      expect(
        screen.queryByText(tiltakspakke2Labels.evalueringsDato.infoMessage),
      ).not.toBeInTheDocument();
      expect(input).toHaveAccessibleDescription(description);
      expect(input.getAttribute("aria-describedby")?.split(" ")).not.toContain(
        "evalueringsDato-info",
      );
    }
  },
);
