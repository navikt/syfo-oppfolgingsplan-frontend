import { act, cleanup, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import {
  DEMO_SIMULATED_BACKEND_DELAY_MS,
  SAVE_UTKAST_DEBOUNCE_DELAY,
} from "@/common/app-config";
import { OppfolgingsplanFormUtfyllt } from "@/schema/oppfolgingsplanForm/formValidationSchemas";
import * as lagreUtkastModule from "@/server/actions/lagreUtkast";
import {
  createMockLagretUtkastResponse,
  renderLagPlanVeiviserComponent,
} from "./LagPlanVeiviser.testUtils";
import { formLabels } from "./form-labels";

// These date values are important for testing "Gå til oppsummering" behavior, since the
// form must be valid to proceed to the next step.
export const mockCurrentTime = new Date("2026-01-14T12:00:00Z");
// Must be between one day and one year after mockCurrentTime for form to be valid.
const mockEvalueringsDatoFormValue = "2026-03-15";

export function createValidFormContent(): OppfolgingsplanFormUtfyllt {
  return {
    typiskArbeidshverdag: "Kontorarbeid med møter",
    arbeidsoppgaverSomKanUtfores: "Skrivearbeid og telefonmøter",
    arbeidsoppgaverSomIkkeKanUtfores: "Tunge løft",
    tidligereTilrettelegging: "Ergonomisk utstyr",
    tilretteleggingFremover: "Hjemmekontor to dager i uken",
    annenTilrettelegging: "Fleksibel arbeidstid",
    hvordanFolgeOpp: "Ukentlige oppfølgingsmøter",
    evalueringsDato: mockEvalueringsDatoFormValue,
    harDenAnsatteMedvirket: "ja",
    denAnsatteHarIkkeMedvirketBegrunnelse: "",
  };
}

describe("LagPlanVeiviser button-triggered saving feature", () => {
  let lagreUtkastSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    vi.setSystemTime(mockCurrentTime);

    // Spy on the lagreUtkastServerAction to verify it gets called
    lagreUtkastSpy = vi.spyOn(lagreUtkastModule, "lagreUtkastServerAction");
  });

  afterEach(() => {
    lagreUtkastSpy.mockRestore();
    vi.useRealTimers();
    cleanup();
  });

  test("does not save again when clicking 'Gå til oppsummering' if changes were already autosaved", async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });

    // Start with a valid form that has all required fields filled
    const validForm = createValidFormContent();
    await renderLagPlanVeiviserComponent(
      createMockLagretUtkastResponse(validForm),
    );

    const typiskArbeidshverdagTextarea = screen.getByLabelText(
      formLabels.typiskArbeidshverdag.label,
    );

    // Make a small edit to trigger autosave
    await user.type(typiskArbeidshverdagTextarea, " - updated");

    // Wait for autosave to trigger (past debounce delay)
    await act(async () => {
      await vi.advanceTimersByTimeAsync(SAVE_UTKAST_DEBOUNCE_DELAY + 100);
    });

    // Verify autosave was triggered
    expect(lagreUtkastSpy).toHaveBeenCalledTimes(1);

    // Wait for autosave to complete (backend delay)
    await act(async () => {
      await vi.advanceTimersByTimeAsync(DEMO_SIMULATED_BACKEND_DELAY_MS + 100);
    });

    // Clear the spy to check if it gets called again
    lagreUtkastSpy.mockClear();

    // Click the "Gå til oppsummering" button
    const goToOppsummeringButton = screen.getByRole("button", {
      name: /gå til oppsummering/i,
    });
    await user.click(goToOppsummeringButton);

    await act(async () => {
      await vi.advanceTimersByTimeAsync(DEMO_SIMULATED_BACKEND_DELAY_MS + 100);
    });

    // The server action should NOT have been called again since there are no new changes
    expect(lagreUtkastSpy).not.toHaveBeenCalled();
  });

  test("does not save again when clicking 'Avslutt og fortsett senere' if changes were already autosaved", async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });

    await renderLagPlanVeiviserComponent(createMockLagretUtkastResponse());

    const typiskArbeidshverdagTextarea = screen.getByLabelText(
      formLabels.typiskArbeidshverdag.label,
    );

    // Make a small edit to trigger autosave
    await user.type(typiskArbeidshverdagTextarea, " - updated");

    // Wait for autosave to trigger (past debounce delay)
    await act(async () => {
      await vi.advanceTimersByTimeAsync(SAVE_UTKAST_DEBOUNCE_DELAY + 100);
    });

    // Verify autosave was triggered
    expect(lagreUtkastSpy).toHaveBeenCalledTimes(1);

    // Wait for autosave to complete (backend delay)
    await act(async () => {
      await vi.advanceTimersByTimeAsync(DEMO_SIMULATED_BACKEND_DELAY_MS + 100);
    });

    // Clear the spy to check if it gets called again
    lagreUtkastSpy.mockClear();

    // Click the "Avslutt og fortsett senere" button
    const avsluttOgFortsettSenereButton = screen.getByRole("button", {
      name: /avslutt og fortsett senere/i,
    });
    await user.click(avsluttOgFortsettSenereButton);

    // Allow the button click handler and any transitions to run
    await act(async () => {
      await vi.advanceTimersByTimeAsync(DEMO_SIMULATED_BACKEND_DELAY_MS + 100);
    });

    // The server action should NOT have been called again since there are no new changes
    expect(lagreUtkastSpy).not.toHaveBeenCalled();
  });

  test("saves unsaved changes immediately when clicking 'Gå til oppsummering'", async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });

    // Start with a valid form that has all required fields filled
    const validForm = createValidFormContent();
    await renderLagPlanVeiviserComponent(
      createMockLagretUtkastResponse(validForm),
    );

    const typiskArbeidshverdagTextarea = screen.getByLabelText(
      formLabels.typiskArbeidshverdag.label,
    );

    // Make a small edit
    await user.type(typiskArbeidshverdagTextarea, " - edit");

    // Advance time, but NOT past the save utkast delay (so autosave should not trigger yet)
    await act(async () => {
      await vi.advanceTimersByTimeAsync(SAVE_UTKAST_DEBOUNCE_DELAY - 500);
    });

    // Verify autosave hasn't happened yet
    expect(lagreUtkastSpy).not.toHaveBeenCalled();

    // Click the "Gå til oppsummering" button before autosave kicks in
    const goToOppsummeringButton = screen.getByRole("button", {
      name: /gå til oppsummering/i,
    });

    await user.click(goToOppsummeringButton);

    expect(screen.getByText("Lagrer utkast...")).toBeInTheDocument();
    expect(lagreUtkastSpy).toHaveBeenCalled();

    // The server action should have been called with the latest form state
    expect(lagreUtkastSpy).toHaveBeenCalledWith(
      "12345",
      expect.objectContaining({
        typiskArbeidshverdag: validForm.typiskArbeidshverdag + " - edit",
      }),
    );
  });

  test("does not save when making no changes to lagret utkast and clicking 'Gå til oppsummering'", async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });

    const validForm = createValidFormContent();
    await renderLagPlanVeiviserComponent(
      createMockLagretUtkastResponse(validForm),
    );

    const goToOppsummeringButton = screen.getByRole("button", {
      name: /gå til oppsummering/i,
    });
    await user.click(goToOppsummeringButton);

    await act(async () => {
      await vi.advanceTimersByTimeAsync(DEMO_SIMULATED_BACKEND_DELAY_MS + 100);
    });

    // Verify no saving has happened
    expect(lagreUtkastSpy).not.toHaveBeenCalled();
  });

  test("does not save when making no changes to lagret utkast and clicking 'Avslutt og fortsett senere'", async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });

    await renderLagPlanVeiviserComponent(
      createMockLagretUtkastResponse({
        typiskArbeidshverdag: "Lagret fra før",
      }),
    );

    const avsluttOgFortsettSenereButton = screen.getByRole("button", {
      name: /avslutt og fortsett senere/i,
    });
    await user.click(avsluttOgFortsettSenereButton);

    await act(async () => {
      await vi.advanceTimersByTimeAsync(DEMO_SIMULATED_BACKEND_DELAY_MS + 100);
    });

    // Verify autosave hasn't happened yet
    expect(lagreUtkastSpy).not.toHaveBeenCalled();
  });
});
