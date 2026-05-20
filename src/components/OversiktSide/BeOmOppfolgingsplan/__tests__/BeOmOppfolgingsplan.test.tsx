import { cleanup, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import type { SykmeldtArbeidsforhold } from "@/schema/oversiktResponseSchemas";
import { render } from "@/test/test-utils";
import { BeOmOppfolgingsplan } from "../BeOmOppfolgingsplan";

vi.mock("@/server/actions/beOmPlan", () => ({
  beOmPlanServerAction: vi.fn(),
}));

vi.mock("@/common/analytics/logAnalyticsEvent", () => ({
  logAnalyticsEvent: vi.fn(),
}));

const baseArbeidsforhold: SykmeldtArbeidsforhold = {
  organisasjonsnummer: "123456789",
  organisasjonsnavn: "Bedrift AS",
  narmesteLederNavn: "Ola Nordmann",
  foresporselStatus: "CAN_REQUEST",
  foresporselTidspunkt: null,
};

describe("BeOmOppfolgingsplan", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  test("shows request button when status is CAN_REQUEST", () => {
    render(
      <BeOmOppfolgingsplan
        arbeidsforhold={[
          { ...baseArbeidsforhold, foresporselStatus: "CAN_REQUEST" },
        ]}
      />,
    );

    expect(
      screen.getByRole("heading", {
        name: "Be lederen din om å lage en oppfølgingsplan",
        level: 3,
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", {
        name: /Be lederen din om å lage en oppfølgingsplan/i,
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByText(/Du har ingen oppfølgingsplan på denne siden\./i),
    ).toBeInTheDocument();
  });

  test("shows confirmation with timestamp when status is ALREADY_REQUESTED", () => {
    render(
      <BeOmOppfolgingsplan
        arbeidsforhold={[
          {
            ...baseArbeidsforhold,
            foresporselStatus: "ALREADY_REQUESTED",
            foresporselTidspunkt: "2025-06-10T09:30:00Z",
          },
        ]}
      />,
    );

    expect(
      screen.getByRole("heading", {
        name: "Be lederen din om å lage en oppfølgingsplan",
        level: 3,
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        /Du har bedt lederen din om å lage en oppfølgingsplan\. Lederen din har fått et varsel og kan begynne på planen\./i,
      ),
    ).toBeInTheDocument();

    const statusElement = screen.getByRole("status");
    expect(statusElement).toHaveTextContent(/Varsel sendt til lederen din/i);

    // Should not show request button
    expect(
      screen.queryByRole("button", {
        name: /Be lederen din om å lage en oppfølgingsplan/i,
      }),
    ).not.toBeInTheDocument();
  });

  test("shows nothing when status is HAS_ACTIVE_PLAN", () => {
    render(
      <BeOmOppfolgingsplan
        arbeidsforhold={[
          { ...baseArbeidsforhold, foresporselStatus: "HAS_ACTIVE_PLAN" },
        ]}
      />,
    );

    expect(screen.queryByRole("heading")).not.toBeInTheDocument();
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  test("shows missing leader warning when status is MISSING_NARMESTELEDER", () => {
    render(
      <BeOmOppfolgingsplan
        arbeidsforhold={[
          {
            ...baseArbeidsforhold,
            foresporselStatus: "MISSING_NARMESTELEDER",
            narmesteLederNavn: null,
          },
        ]}
      />,
    );

    expect(
      screen.getByRole("heading", {
        name: "Vi mangler informasjon om nærmeste leder",
        level: 3,
      }),
    ).toBeInTheDocument();

    expect(screen.getByText(/Bedrift AS/i)).toBeInTheDocument();
  });

  test("shows nothing when status is NARMESTELEDER_UNKNOWN", () => {
    render(
      <BeOmOppfolgingsplan
        arbeidsforhold={[
          { ...baseArbeidsforhold, foresporselStatus: "NARMESTELEDER_UNKNOWN" },
        ]}
      />,
    );

    expect(screen.queryByRole("heading")).not.toBeInTheDocument();
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  test("shows fallback text when ALREADY_REQUESTED but no timestamp", () => {
    render(
      <BeOmOppfolgingsplan
        arbeidsforhold={[
          {
            ...baseArbeidsforhold,
            foresporselStatus: "ALREADY_REQUESTED",
            foresporselTidspunkt: null,
          },
        ]}
      />,
    );

    expect(
      screen.getByText(/Varsel sendt til lederen din/i),
    ).toBeInTheDocument();
  });

  test("uses organisasjonsnummer as fallback when organisasjonsnavn is null", () => {
    render(
      <BeOmOppfolgingsplan
        arbeidsforhold={[
          {
            ...baseArbeidsforhold,
            foresporselStatus: "MISSING_NARMESTELEDER",
            organisasjonsnavn: null,
            narmesteLederNavn: null,
          },
        ]}
      />,
    );

    expect(screen.getByText(/123456789/i)).toBeInTheDocument();
  });

  test("renders multiple arbeidsforhold with org names in headings", () => {
    render(
      <BeOmOppfolgingsplan
        arbeidsforhold={[
          {
            ...baseArbeidsforhold,
            foresporselStatus: "CAN_REQUEST",
            organisasjonsnummer: "111111111",
            organisasjonsnavn: "Firma A",
          },
          {
            ...baseArbeidsforhold,
            foresporselStatus: "MISSING_NARMESTELEDER",
            organisasjonsnummer: "222222222",
            organisasjonsnavn: "Firma B",
            narmesteLederNavn: null,
          },
        ]}
      />,
    );

    expect(
      screen.getByRole("heading", {
        name: /Be lederen din hos Firma A om å lage en oppfølgingsplan/i,
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("heading", {
        name: /Vi mangler informasjon om nærmeste leder hos Firma B/i,
      }),
    ).toBeInTheDocument();
  });
});
