import { cleanup, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import * as delPlanMedLegeModule from "@/server/actions/delPlanMedLege";
import * as delPlanMedVeilederModule from "@/server/actions/delPlanMedVeileder";
import { render } from "@/test/test-utils";
import { PlanDelingProvider } from "../../PlanDelingContext";
import DelAktivPlanMedLegeEllerNav from "../DelAktivPlanMedLegeEllerNav";

const MOCK_PLAN_ID = "test-plan-123";
const MOCK_LEDER_ID = "test-leder-123";

vi.mock("next/navigation", () => ({
  useParams: () => ({ narmesteLederId: MOCK_LEDER_ID }),
}));

describe("DelAktivPlanMedLegeEllerNav", () => {
  let delMedLegeSpy: ReturnType<typeof vi.spyOn>;
  let delMedVeilederSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    delMedLegeSpy = vi.spyOn(
      delPlanMedLegeModule,
      "delPlanMedLegeServerAction",
    );
    delMedVeilederSpy = vi.spyOn(
      delPlanMedVeilederModule,
      "delPlanMedVeilederServerAction",
    );
  });

  afterEach(() => {
    delMedLegeSpy.mockRestore();
    delMedVeilederSpy.mockRestore();
    cleanup();
  });

  function renderComponent(
    initialDeltMedLegeTidspunkt: string | null = null,
    initialDeltMedVeilederTidspunkt: string | null = null,
  ) {
    return render(
      <PlanDelingProvider
        initialDeltMedLegeTidspunkt={initialDeltMedLegeTidspunkt}
        initialDeltMedVeilederTidspunkt={initialDeltMedVeilederTidspunkt}
      >
        <DelAktivPlanMedLegeEllerNav planId={MOCK_PLAN_ID} />
      </PlanDelingProvider>,
    );
  }

  describe("Initial rendering", () => {
    test("renders heading and description", () => {
      renderComponent();

      expect(
        screen.getByRole("heading", {
          name: /hvem vil du sende planen til/i,
          level: 2,
        }),
      ).toBeInTheDocument();

      expect(
        screen.getByText(/det er krav om å sende oppfølgingsplanen/i),
      ).toBeInTheDocument();
    });

    test("renders both checkboxes when nothing has been sent", () => {
      renderComponent();

      expect(
        screen.getByRole("checkbox", { name: /fastlegen til den ansatte/i }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("checkbox", { name: /nav-veileder/i }),
      ).toBeInTheDocument();
    });

    test("renders send button when there are unsent recipients", () => {
      renderComponent();

      expect(
        screen.getByRole("button", { name: /send planen/i }),
      ).toBeInTheDocument();
    });

    test("does not render send button when all recipients have received plan", () => {
      renderComponent("2026-01-15T10:00:00Z", "2026-01-15T11:00:00Z");

      expect(
        screen.queryByRole("button", { name: /send planen/i }),
      ).not.toBeInTheDocument();
    });
  });

  describe("Sent status display", () => {
    test("shows success message when plan was sent to fastlege", () => {
      renderComponent("2026-01-15T10:30:00Z", null);

      expect(screen.getByText(/sendt til fastlege/i)).toBeInTheDocument();
      expect(screen.getByText(/15\. januar/i)).toBeInTheDocument();
    });

    test("shows success message when plan was sent to veileder", () => {
      renderComponent(null, "2026-01-15T11:45:00Z");

      expect(screen.getByText(/sendt til nav-veileder/i)).toBeInTheDocument();
      expect(screen.getByText(/15\. januar/i)).toBeInTheDocument();
    });

    test("hides checkbox when plan was sent to that recipient", () => {
      renderComponent("2026-01-15T10:00:00Z", null);

      expect(
        screen.queryByRole("checkbox", { name: /fastlegen til den ansatte/i }),
      ).not.toBeInTheDocument();

      expect(
        screen.getByRole("checkbox", { name: /nav-veileder/i }),
      ).toBeInTheDocument();
    });

    test("shows both success messages when sent to both recipients", () => {
      renderComponent("2026-01-15T10:00:00Z", "2026-01-15T11:00:00Z");

      expect(screen.getByText(/sendt til fastlege/i)).toBeInTheDocument();
      expect(screen.getByText(/sendt til nav-veileder/i)).toBeInTheDocument();
    });
  });

  describe("Form submission validation", () => {
    test("shows validation error when submitting without selecting any checkbox", async () => {
      const user = userEvent.setup();
      renderComponent();

      const sendButton = screen.getByRole("button", { name: /send planen/i });
      await user.click(sendButton);

      await waitFor(() => {
        expect(
          screen.getByText(
            /du må velge minst ett alternativ for å sende planen/i,
          ),
        ).toBeInTheDocument();
      });

      expect(delMedLegeSpy).not.toHaveBeenCalled();
      expect(delMedVeilederSpy).not.toHaveBeenCalled();
    });

    test("validation error is shown in ErrorSummary component", async () => {
      const user = userEvent.setup();
      renderComponent();

      const sendButton = screen.getByRole("button", { name: /send planen/i });
      await user.click(sendButton);

      await waitFor(() => {
        expect(
          screen.getByRole("heading", { name: /feil ved sending av plan/i }),
        ).toBeInTheDocument();
      });
    });
  });

  describe("Form submission with selections", () => {
    test("calls delMedLegeAction when only fastlege checkbox is selected", async () => {
      const user = userEvent.setup();
      delMedLegeSpy.mockResolvedValue({
        deltMedLegeTidspunkt: "2026-01-15T10:00:00Z",
        errorDelMedLege: null,
      });

      renderComponent();

      const fastlegeCheckbox = screen.getByRole("checkbox", {
        name: /fastlegen til den ansatte/i,
      });
      await user.click(fastlegeCheckbox);

      const sendButton = screen.getByRole("button", { name: /send planen/i });
      await user.click(sendButton);

      await waitFor(() => {
        expect(delMedLegeSpy).toHaveBeenCalledWith(MOCK_LEDER_ID, MOCK_PLAN_ID);
      });

      expect(delMedVeilederSpy).not.toHaveBeenCalled();
    });

    test("calls delMedVeilederAction when only veileder checkbox is selected", async () => {
      const user = userEvent.setup();
      delMedVeilederSpy.mockResolvedValue({
        deltMedVeilederTidspunkt: "2026-01-15T11:00:00Z",
        errorDelMedVeileder: null,
      });

      renderComponent();

      const veilederCheckbox = screen.getByRole("checkbox", {
        name: /nav-veileder/i,
      });
      await user.click(veilederCheckbox);

      const sendButton = screen.getByRole("button", { name: /send planen/i });
      await user.click(sendButton);

      await waitFor(() => {
        expect(delMedVeilederSpy).toHaveBeenCalledWith(
          MOCK_LEDER_ID,
          MOCK_PLAN_ID,
        );
      });

      expect(delMedLegeSpy).not.toHaveBeenCalled();
    });

    test("calls both actions when both checkboxes are selected", async () => {
      const user = userEvent.setup();
      delMedLegeSpy.mockResolvedValue({
        deltMedLegeTidspunkt: "2026-01-15T10:00:00Z",
        errorDelMedLege: null,
      });
      delMedVeilederSpy.mockResolvedValue({
        deltMedVeilederTidspunkt: "2026-01-15T11:00:00Z",
        errorDelMedVeileder: null,
      });

      renderComponent();

      const fastlegeCheckbox = screen.getByRole("checkbox", {
        name: /fastlegen til den ansatte/i,
      });
      const veilederCheckbox = screen.getByRole("checkbox", {
        name: /nav-veileder/i,
      });

      await user.click(fastlegeCheckbox);
      await user.click(veilederCheckbox);

      const sendButton = screen.getByRole("button", { name: /send planen/i });
      await user.click(sendButton);

      await waitFor(() => {
        expect(delMedLegeSpy).toHaveBeenCalledWith(MOCK_LEDER_ID, MOCK_PLAN_ID);
        expect(delMedVeilederSpy).toHaveBeenCalledWith(
          MOCK_LEDER_ID,
          MOCK_PLAN_ID,
        );
      });
    });
  });

  describe("Accessibility", () => {
    test("checkboxes have proper labels", () => {
      renderComponent();

      const fastlegeCheckbox = screen.getByRole("checkbox", {
        name: /fastlegen til den ansatte/i,
      });
      const veilederCheckbox = screen.getByRole("checkbox", {
        name: /nav-veileder/i,
      });

      expect(fastlegeCheckbox).toBeInTheDocument();
      expect(veilederCheckbox).toBeInTheDocument();
    });

    test("success messages have proper role", () => {
      renderComponent("2026-01-15T10:00:00Z", "2026-01-15T11:00:00Z");

      const successMessages = screen.getAllByRole("status");
      expect(successMessages).toHaveLength(2);
    });

    test("error summary has proper heading", async () => {
      const user = userEvent.setup();
      renderComponent();

      const sendButton = screen.getByRole("button", { name: /send planen/i });
      await user.click(sendButton);

      await waitFor(() => {
        expect(
          screen.getByRole("heading", { name: /feil ved sending av plan/i }),
        ).toBeInTheDocument();
      });
    });
  });
});
