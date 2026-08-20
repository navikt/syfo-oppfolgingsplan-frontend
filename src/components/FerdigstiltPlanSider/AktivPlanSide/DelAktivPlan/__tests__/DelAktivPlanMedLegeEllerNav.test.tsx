import { cleanup, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useParams } from "next/navigation";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import * as delPlanMedLegeModule from "@/server/actions/delPlanMedLege";
import * as delPlanMedVeilederModule from "@/server/actions/delPlanMedVeileder";
import { render } from "@/test/test-utils";
import { PlanDelingProvider } from "../../PlanDelingContext";
import DelAktivPlanMedLegeEllerNav from "../DelAktivPlanMedLegeEllerNav";

const MOCK_PLAN_ID = "test-plan-123";
const MOCK_LEDER_ID = "test-leder-123";

vi.mock("next/navigation", async () => {
  const { mockNextNavigation } = await import(
    "@/test/mocks/nextNavigationMock"
  );

  return mockNextNavigation();
});

describe("DelAktivPlanMedLegeEllerNav", () => {
  let delMedLegeSpy: ReturnType<typeof vi.spyOn>;
  let delMedVeilederSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    vi.mocked(useParams).mockReturnValue({ narmesteLederId: MOCK_LEDER_ID });
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
    erITiltaksgruppe = false,
  ) {
    return render(
      <PlanDelingProvider
        initialDeltMedLegeTidspunkt={initialDeltMedLegeTidspunkt}
        initialDeltMedVeilederTidspunkt={initialDeltMedVeilederTidspunkt}
      >
        <DelAktivPlanMedLegeEllerNav
          planId={MOCK_PLAN_ID}
          erITiltaksgruppe={erITiltaksgruppe}
        />
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
        screen.getByText(
          /Du skal sende oppfølgingsplanen til fastlegen innen den ansatte har vært helt eller delvis borte fra jobben i 4 uker./i,
        ),
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

    test("shows the sharing box when only one recipient has received the plan", () => {
      renderComponent("2026-01-15T10:00:00Z", null);

      expect(
        screen.getByRole("heading", {
          name: /hvem vil du sende planen til/i,
          level: 2,
        }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /send planen/i }),
      ).toBeInTheDocument();
    });

    test("hides the whole sharing box when all recipients have received plan", () => {
      renderComponent("2026-01-15T10:00:00Z", "2026-01-15T11:00:00Z");

      expect(
        screen.queryByRole("heading", {
          name: /hvem vil du sende planen til/i,
        }),
      ).not.toBeInTheDocument();
      expect(
        screen.queryByRole("button", { name: /send planen/i }),
      ).not.toBeInTheDocument();
      expect(screen.queryByRole("checkbox")).not.toBeInTheDocument();
      expect(screen.queryByText(/sendt til fastlege/i)).not.toBeInTheDocument();
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

    test("keeps the checkbox for the recipient that has not received the plan", () => {
      renderComponent("2026-01-15T10:00:00Z", null);

      expect(screen.getByText(/sendt til fastlege/i)).toBeInTheDocument();
      expect(
        screen.getByRole("checkbox", { name: /nav-veileder/i }),
      ).toBeInTheDocument();
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

    test("hides the sharing box without reload when the last recipient receives the plan", async () => {
      const user = userEvent.setup();
      delMedVeilederSpy.mockResolvedValue({
        deltMedVeilederTidspunkt: "2026-01-16T11:00:00Z",
        errorDelMedVeileder: null,
      });

      renderComponent("2026-01-15T10:00:00Z", null);

      const veilederCheckbox = screen.getByRole("checkbox", {
        name: /nav-veileder/i,
      });
      await user.click(veilederCheckbox);
      await user.click(screen.getByRole("button", { name: /send planen/i }));

      await waitFor(() => {
        expect(
          screen.queryByRole("heading", {
            name: /hvem vil du sende planen til/i,
          }),
        ).not.toBeInTheDocument();
      });
    });
  });

  describe("Tekstvarianter styrt av flaggskip-oppsettet", () => {
    const TILTAKSGRUPPE_OVERSKRIFT =
      "Del oppfølgingsplanen med fastlege og Nav";
    const TILTAKSGRUPPE_BESKRIVELSE =
      "Det er et krav om å dele oppfølgingsplanen med fastlegen innen de første 4 ukene av sykefraværsperioden. I tillegg kan du dele den med Nav når du selv ønsker eller senest én uke før dialogmøte med Nav (Nav kan også be om å få den tilsendt).";
    const STANDARD_OVERSKRIFT = "Hvem vil du sende planen til";
    const STANDARD_BESKRIVELSE =
      "Du skal sende oppfølgingsplanen til fastlegen innen den ansatte har vært helt eller delvis borte fra jobben i 4 uker. I tillegg kan du sende planen til Nav når du selv ønsker, når Nav ber om den, eller senest én uke før et dialogmøte med Nav.";
    const FASTLEGE_HJELPETEKST =
      "Hensikten er at fastlegen har innsikt i arbeidssituasjonen før neste konsultasjon med den som er sykmeldt.";
    const VEILEDER_HJELPETEKST =
      "Hensikten er at Nav har riktig informasjon for å bidra på best mulig måte i sykefraværet.";

    test("viser dagens tekster og knappnavn for brukere utenfor tiltaksgruppen", () => {
      renderComponent(null, null, false);

      expect(
        screen.getByRole("heading", { name: STANDARD_OVERSKRIFT, level: 2 }),
      ).toBeInTheDocument();
      expect(screen.getByText(STANDARD_BESKRIVELSE)).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: "Send planen" }),
      ).toBeInTheDocument();

      expect(
        screen.queryByRole("heading", { name: TILTAKSGRUPPE_OVERSKRIFT }),
      ).not.toBeInTheDocument();
      expect(
        screen.queryByText(TILTAKSGRUPPE_BESKRIVELSE),
      ).not.toBeInTheDocument();
      expect(
        screen.queryByRole("button", { name: "Del planen" }),
      ).not.toBeInTheDocument();
    });

    test("viser tekster og knappnavn fra tiltakspakken for brukere i tiltaksgruppen", () => {
      renderComponent(null, null, true);

      expect(
        screen.getByRole("heading", {
          name: TILTAKSGRUPPE_OVERSKRIFT,
          level: 2,
        }),
      ).toBeInTheDocument();
      expect(screen.getByText(TILTAKSGRUPPE_BESKRIVELSE)).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: "Del planen" }),
      ).toBeInTheDocument();

      expect(
        screen.queryByRole("heading", { name: STANDARD_OVERSKRIFT }),
      ).not.toBeInTheDocument();
      expect(screen.queryByText(STANDARD_BESKRIVELSE)).not.toBeInTheDocument();
      expect(
        screen.queryByRole("button", { name: "Send planen" }),
      ).not.toBeInTheDocument();
    });

    test("beholder avkrysningsbokser og delingsflyt i tiltaksgruppen", async () => {
      const user = userEvent.setup();
      delMedLegeSpy.mockResolvedValue({
        deltMedLegeTidspunkt: "2026-01-15T10:00:00Z",
        errorDelMedLege: null,
      });

      renderComponent(null, null, true);

      await user.click(
        screen.getByRole("checkbox", { name: /fastlegen til den ansatte/i }),
      );
      await user.click(screen.getByRole("button", { name: "Del planen" }));

      await waitFor(() => {
        expect(delMedLegeSpy).toHaveBeenCalledWith(MOCK_LEDER_ID, MOCK_PLAN_ID);
      });
    });

    test("viser hjelpetekst under begge avkrysningsboksene i tiltaksgruppen", () => {
      renderComponent(null, null, true);

      expect(screen.getByText(FASTLEGE_HJELPETEKST)).toBeInTheDocument();
      expect(screen.getByText(VEILEDER_HJELPETEKST)).toBeInTheDocument();
    });

    test("knytter hjelpetekstene til riktig avkrysningsboks for skjermlesere", () => {
      renderComponent(null, null, true);

      expect(
        screen.getByRole("checkbox", { name: /fastlegen til den ansatte/i }),
      ).toHaveAccessibleDescription(FASTLEGE_HJELPETEKST);
      expect(
        screen.getByRole("checkbox", { name: /nav-veileder/i }),
      ).toHaveAccessibleDescription(VEILEDER_HJELPETEKST);
    });

    test("beholder dagens labels på avkrysningsboksene i tiltaksgruppen", () => {
      renderComponent(null, null, true);

      expect(
        screen.getByRole("checkbox", { name: /fastlegen til den ansatte/i }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("checkbox", { name: /nav-veilederen/i }),
      ).toBeInTheDocument();
    });

    test("viser ingen hjelpetekster for brukere utenfor tiltaksgruppen", () => {
      renderComponent(null, null, false);

      expect(screen.queryByText(FASTLEGE_HJELPETEKST)).not.toBeInTheDocument();
      expect(screen.queryByText(VEILEDER_HJELPETEKST)).not.toBeInTheDocument();
      expect(
        screen.getByRole("checkbox", { name: /fastlegen til den ansatte/i }),
      ).toHaveAccessibleDescription("");
      expect(
        screen.getByRole("checkbox", { name: /nav-veileder/i }),
      ).toHaveAccessibleDescription("");
    });

    test("viser ikke hjelpetekst for en mottaker som allerede har fått planen", () => {
      renderComponent("2026-01-15T10:00:00Z", null, true);

      expect(
        screen.queryByRole("checkbox", { name: /fastlegen til den ansatte/i }),
      ).not.toBeInTheDocument();
      expect(screen.queryByText(FASTLEGE_HJELPETEKST)).not.toBeInTheDocument();

      expect(screen.getByText(VEILEDER_HJELPETEKST)).toBeInTheDocument();
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
      renderComponent("2026-01-15T10:00:00Z", null);

      const successMessages = screen.getAllByRole("status");
      expect(successMessages).toHaveLength(1);
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
