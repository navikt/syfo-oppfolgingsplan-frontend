import { act, cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import {
  DEMO_SIMULATED_BACKEND_DELAY_MS,
  SAVE_UTKAST_DEBOUNCE_DELAY,
} from "@/common/app-config";
import { OppfolgingsplanFormUnderArbeid } from "@/schema/oppfolgingsplanForm/formValidationSchemas";
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

describe("LagPlanVeiviser autosave feature", () => {
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

  test("resets debounce timer when user continues typing", async () => {
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
});
