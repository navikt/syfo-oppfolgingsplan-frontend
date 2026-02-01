import { cleanup, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { fetchOppfolgingsplanOversiktForAG } from "@/server/fetchData/arbeidsgiver/fetchOppfolgingsplanOversikt";
import { mockOversiktDataMedPlanerForAG } from "@/server/fetchData/mockData/mockOversiktData";
import { mockOversiktDataNoEditAccess } from "@/server/fetchData/mockData/mockOversiktDataVariants";
import { renderAsync } from "@/test/test-utils";
import { AnsattIkkeSykmeldtAlert } from "../AnsattIkkeSykmeldtAlert";

vi.mock("@/server/fetchData/arbeidsgiver/fetchOppfolgingsplanOversikt");

const mockFetch = vi.mocked(fetchOppfolgingsplanOversiktForAG);

describe("AnsattIkkeSykmeldtAlert", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  test("shows alert when userHasEditAccess is false", async () => {
    mockFetch.mockResolvedValue({
      error: null,
      data: mockOversiktDataNoEditAccess,
    });

    await renderAsync(AnsattIkkeSykmeldtAlert({ narmesteLederId: "12345" }));

    expect(
      screen.getByRole("heading", {
        name: /Den ansatte er ikke sykmeldt/i,
        level: 3,
      }),
    ).toBeInTheDocument();
  });

  test("does not show alert when userHasEditAccess is true", async () => {
    mockFetch.mockResolvedValue({
      error: null,
      data: mockOversiktDataMedPlanerForAG, // userHasEditAccess: true
    });

    await renderAsync(AnsattIkkeSykmeldtAlert({ narmesteLederId: "12345" }));

    expect(
      screen.queryByRole("heading", {
        name: /Den ansatte er ikke sykmeldt/i,
      }),
    ).not.toBeInTheDocument();
  });

  test("alert has correct message content", async () => {
    mockFetch.mockResolvedValue({
      error: null,
      data: mockOversiktDataNoEditAccess,
    });

    await renderAsync(AnsattIkkeSykmeldtAlert({ narmesteLederId: "12345" }));

    // Check for key parts of the message
    expect(
      screen.getByText(/Du kan ikke opprette en oppfølgingsplan/i),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/mindre enn 16 dager siden siste sykmeldingsdato/i),
    ).toBeInTheDocument();
  });

  test("returns null when fetch fails", async () => {
    mockFetch.mockResolvedValue({
      error: {
        type: "FETCH_NETWORK_ERROR",
        message: "Network error",
      },
      data: null,
    });

    await renderAsync(AnsattIkkeSykmeldtAlert({ narmesteLederId: "12345" }));

    // Component returns null, alert should not be present
    expect(
      screen.queryByRole("heading", {
        name: /Den ansatte er ikke sykmeldt/i,
      }),
    ).not.toBeInTheDocument();
  });
});
