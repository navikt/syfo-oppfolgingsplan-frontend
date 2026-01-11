import { act, cleanup, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import {
  DEMO_SIMULATED_BACKEND_DELAY_MS,
  SAVE_UTKAST_DEBOUNCE_DELAY,
} from "@/common/app-config";
import * as lagreUtkastModule from "@/server/actions/lagreUtkast";
import {
  createMockLagretUtkastResponse,
  renderComponent,
} from "./LagPlanVeiviser.testUtils";
import { formLabels } from "./form-labels";

describe("LagPlanVeiviser lagre utkast feature", () => {
  let lagreUtkastSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    // Spy on the lagreUtkastServerAction to verify it gets called
    lagreUtkastSpy = vi.spyOn(lagreUtkastModule, "lagreUtkastServerAction");
  });

  afterEach(() => {
    lagreUtkastSpy.mockRestore();
    vi.useRealTimers();
    cleanup();
  });

  test("autosaves when user types in form field, shows 'Lagrer utkast...' during save, and calls lagreUtkastServerAction", async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });

    await renderComponent(createMockLagretUtkastResponse());

    // Get the first text area field
    const typiskArbeidshverdagTextarea = screen.getByLabelText(
      formLabels.typiskArbeidshverdag.label,
    );

    // Type some text in the field
    await user.type(
      typiskArbeidshverdagTextarea,
      "Test arbeidsdag beskrivelse",
    );

    // Advance timers past the debounce delay to trigger autosave
    await act(async () => {
      await vi.advanceTimersByTimeAsync(SAVE_UTKAST_DEBOUNCE_DELAY + 100);
    });

    // The "Lagrer utkast..." text should appear while saving
    expect(screen.getByText("Lagrer utkast...")).toBeInTheDocument();

    // Verify that lagreUtkastServerAction was called
    expect(lagreUtkastSpy).toHaveBeenCalled();
    expect(lagreUtkastSpy).toHaveBeenCalledWith(
      "12345",
      expect.objectContaining({
        typiskArbeidshverdag: "Test arbeidsdag beskrivelse",
      }),
    );

    // Advance past the simulated backend delay
    await act(async () => {
      await vi.advanceTimersByTimeAsync(DEMO_SIMULATED_BACKEND_DELAY_MS + 100);
    });

    // After save completes, "Lagrer utkast..." should disappear
    expect(screen.queryByText("Lagrer utkast...")).not.toBeInTheDocument();
  });

  test("resets autosave debounce timer when user continues typing", async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });

    await renderComponent(createMockLagretUtkastResponse());

    const typiskArbeidshverdagTextarea = screen.getByLabelText(
      formLabels.typiskArbeidshverdag.label,
    );

    // Type first part
    await user.type(typiskArbeidshverdagTextarea, "First");

    // Advance timers almost until debounce would trigger
    await act(async () => {
      await vi.advanceTimersByTimeAsync(SAVE_UTKAST_DEBOUNCE_DELAY - 200);
    });

    // Type more - this should reset the debounce timer
    await user.type(typiskArbeidshverdagTextarea, " second");

    // Advance timers by less than debounce delay (after the second typing)
    await act(async () => {
      await vi.advanceTimersByTimeAsync(SAVE_UTKAST_DEBOUNCE_DELAY - 200);
    });

    // Save should NOT have started yet because debounce was reset
    expect(screen.queryByText("Lagrer utkast...")).not.toBeInTheDocument();

    // Now advance past the debounce delay
    await act(async () => {
      await vi.advanceTimersByTimeAsync(300);
    });

    // Now the save should be in progress
    expect(screen.getByText("Lagrer utkast...")).toBeInTheDocument();

    // Verify the server action was called with the complete text
    // (including both "First" and " second", not just "First")
    expect(lagreUtkastSpy).toHaveBeenCalledWith(
      "12345",
      expect.objectContaining({
        typiskArbeidshverdag: "First second",
      }),
    );
  });

  test("does not save when users makes an edit and then reverts it before debounce delay", async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });

    await renderComponent(createMockLagretUtkastResponse());

    const typiskArbeidshverdagTextarea = screen.getByLabelText(
      formLabels.typiskArbeidshverdag.label,
    );

    // Make an edit
    await user.type(typiskArbeidshverdagTextarea, "Some changes");

    await act(async () => {
      await vi.advanceTimersByTimeAsync(SAVE_UTKAST_DEBOUNCE_DELAY - 500);
    });

    // Revert the edit
    await user.clear(typiskArbeidshverdagTextarea);

    // Advance past debounce delay
    await act(async () => {
      await vi.advanceTimersByTimeAsync(SAVE_UTKAST_DEBOUNCE_DELAY + 100);
    });

    // Verify no saving has happened
    expect(lagreUtkastSpy).not.toHaveBeenCalled();
  });
});
