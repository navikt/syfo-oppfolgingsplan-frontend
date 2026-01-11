import { act, cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import {
  DEMO_SIMULATED_BACKEND_DELAY_MS,
  SAVE_UTKAST_DEBOUNCE_DELAY,
} from "@/common/app-config";
import {
  OppfolgingsplanFormUnderArbeid,
  OppfolgingsplanFormUtfyllt,
} from "@/schema/oppfolgingsplanForm/formValidationSchemas";
import { ConvertedLagretUtkastResponse } from "@/schema/utkastResponseSchema";
import * as lagreUtkastModule from "@/server/actions/lagreUtkast";
import LagPlanVeiviser from "./LagPlanVeiviser";
import { formLabels } from "./form-labels";

// Mock next/navigation
vi.mock("next/navigation", () => ({
  useParams: () => ({ narmesteLederId: "12345" }),
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
  }),
}));

// Mock the taxonomy event logging
vi.mock("@/common/logTaxonomyEvent", () => ({
  logTaxonomyEvent: vi.fn(),
}));

// Mock scrollToAppTop to avoid issues in test environment
vi.mock("@/utils/scrollToAppTop", () => ({
  scrollToAppTopForAG: vi.fn(),
  scrollToAppTopForSM: vi.fn(),
}));

function createMockLagretUtkastResponse(
  alreadyLagretUtkast?: OppfolgingsplanFormUnderArbeid,
): ConvertedLagretUtkastResponse {
  const utkastAndSistLagretTidspunkt = alreadyLagretUtkast
    ? {
        content: alreadyLagretUtkast,
        sistLagretTidspunkt: "2024-06-01T12:00:00Z",
      }
    : null;

  return {
    userHasEditAccess: true,
    utkast: utkastAndSistLagretTidspunkt,
    organization: {
      orgNumber: "123456789",
      orgName: "Test Bedrift AS",
    },
    employee: {
      fnr: "12345678901",
      name: "Test Ansatt",
    },
  };
}

/**
 * Creates a complete valid form with all required fields filled.
 * This is needed for testing form submission, since handleSubmit
 * only calls onSubmit if the form is valid.
 */
function createValidFormContent(): OppfolgingsplanFormUtfyllt {
  // Use a date far in the future to ensure it's always valid
  // (the schema requires evalueringsDato to be tomorrow or later)
  return {
    typiskArbeidshverdag: "Kontorarbeid med møter",
    arbeidsoppgaverSomKanUtfores: "Skrivearbeid og telefonmøter",
    arbeidsoppgaverSomIkkeKanUtfores: "Tunge løft",
    tidligereTilrettelegging: "Ergonomisk utstyr",
    tilretteleggingFremover: "Hjemmekontor to dager i uken",
    annenTilrettelegging: "Fleksibel arbeidstid",
    hvordanFolgeOpp: "Ukentlige oppfølgingsmøter",
    evalueringsDato: "2030-03-01",
    harDenAnsatteMedvirket: "ja",
    denAnsatteHarIkkeMedvirketBegrunnelse: "",
  };
}

async function renderComponent(mockData: ConvertedLagretUtkastResponse) {
  // Create a promise that is already resolved
  const lagretUtkastPromise = Promise.resolve(mockData);

  let renderResult: ReturnType<typeof render>;

  await act(async () => {
    renderResult = render(
      <LagPlanVeiviser lagretUtkastPromise={lagretUtkastPromise} />,
    );
  });

  return renderResult!;
}

describe("LagPlanVeiviser lagre utkast feature", () => {
  let lagreUtkastSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    // Use fake timers with shouldAdvanceTime to allow promises to resolve
    // while still controlling time for debounce testing
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

  test("does not save again when clicking 'Gå til oppsummering' if changes were already autosaved", async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });

    // Start with a valid form that has all required fields filled
    const validForm = createValidFormContent();
    await renderComponent(createMockLagretUtkastResponse(validForm));

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

    // Allow the button click handler and any transitions to run
    await act(async () => {
      await vi.advanceTimersByTimeAsync(DEMO_SIMULATED_BACKEND_DELAY_MS + 100);
    });

    // The server action should NOT have been called again since there are no new changes
    expect(lagreUtkastSpy).not.toHaveBeenCalled();
  });

  test("does not save again when clicking 'Avslutt og fortsett senere' if changes were already autosaved", async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });

    await renderComponent(createMockLagretUtkastResponse());

    const typiskArbeidshverdagTextarea = screen.getByLabelText(
      formLabels.typiskArbeidshverdag.label,
    );

    // Make a small edit to trigger autosave
    await user.type(typiskArbeidshverdagTextarea, "Some changes");

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

  test("saves unsaved changes when clicking 'Gå til oppsummering'", async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });

    // Start with a valid form that has all required fields filled
    const validForm = createValidFormContent();
    await renderComponent(createMockLagretUtkastResponse(validForm));

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

    // It's difficult to ensure that the save is triggered via the button and
    // not via the debounced autosave. However, the presence of the text
    // "Lagrer utkast..." indicates the save was triggered via the button,
    // since this text appears only in FyllUtPlanSteg and not in OppsummeringSteg.
    // With the current timing it would not have time to appear via the
    // debounced autosave before navigating to OppsummeringSteg.
    await waitFor(() => {
      expect(screen.getByText("Lagrer utkast...")).toBeInTheDocument();
    });

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
    await renderComponent(createMockLagretUtkastResponse(validForm));

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

    await renderComponent(
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
