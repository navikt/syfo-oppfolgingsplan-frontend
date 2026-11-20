import { cleanup, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, expect, test } from "vitest";
import { dialogmoteTiltakspakkeLabels, formLabels } from "./form-labels";
import {
  createMockLagretUtkastResponse,
  renderLagPlanVeiviserComponent,
} from "./LagPlanVeiviser.testUtils";

afterEach(cleanup);

test.each([
  [false, true, true],
  [true, true, true],
  [true, true, false],
  [true, false, false],
])(
  "date guidance with package 2 active=%s, no plans in virksomhet=%s and package 1 active=%s",
  async (isDialogmoteTiltakspakkeActive, hasNoPlansInVirksomhet, isOppfolgingsplanTiltakspakkeActive) => {
    const user = userEvent.setup();
    await renderLagPlanVeiviserComponent(
      createMockLagretUtkastResponse(),
      isOppfolgingsplanTiltakspakkeActive,
      { isDialogmoteTiltakspakkeActive, hasNoPlansInVirksomhet },
    );

    const description = isDialogmoteTiltakspakkeActive
      ? dialogmoteTiltakspakkeLabels.evalueringsDato.description
      : formLabels.evalueringsDato.description;
    const input = screen.getByRole("textbox", {
      name: formLabels.evalueringsDato.label,
    });
    expect(screen.getByText(description)).toBeVisible();
    const reminder = screen.queryByRole("radiogroup", {
      name: formLabels.evalueringPaaminnelse.label,
    });
    if (isOppfolgingsplanTiltakspakkeActive) {
      expect(reminder).toBeVisible();
    } else {
      expect(reminder).not.toBeInTheDocument();
    }

    const message = document.getElementById("evalueringsDato-info");
    if (isDialogmoteTiltakspakkeActive && hasNoPlansInVirksomhet) {
      expect(message).toBeVisible();
      expect(
        screen.getByText(
          dialogmoteTiltakspakkeLabels.evalueringsDato.infoMessage,
        ),
      ).toBeVisible();
      expect(input.getAttribute("aria-describedby")?.split(" ")).toContain(
        "evalueringsDato-info",
      );
      expect(input).toHaveAccessibleDescription(
        expect.stringContaining(
          dialogmoteTiltakspakkeLabels.evalueringsDato.infoMessage,
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
      const errorId = describedBy?.find(
        (id) => id !== message?.id && id !== screen.getByText(description).id,
      );
      expect(document.getElementById(errorId ?? "")).not.toBeEmptyDOMElement();
    } else {
      expect(message).not.toBeInTheDocument();
      expect(
        screen.queryByText(
          dialogmoteTiltakspakkeLabels.evalueringsDato.infoMessage,
        ),
      ).not.toBeInTheDocument();
      expect(input).toHaveAccessibleDescription(description);
      expect(input.getAttribute("aria-describedby")?.split(" ")).not.toContain(
        "evalueringsDato-info",
      );
    }
  },
);
