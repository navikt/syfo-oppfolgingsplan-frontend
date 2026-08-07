import { cleanup, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { fetchOppfolgingsplanOversiktForAG } from "@/server/fetchData/arbeidsgiver/fetchOppfolgingsplanOversikt";
import {
  mockOversiktDataEmptyWithAccess,
  mockOversiktDataMedUnntak,
  mockOversiktDataOnlyActivePlan,
} from "@/server/fetchData/mockData/mockOversiktDataVariants";
import { renderAsync } from "@/test/test-utils";
import GjeldendeUnntakInfoCard from "../GjeldendeUnntakInfoCard";

const mockFetch = vi.mocked(fetchOppfolgingsplanOversiktForAG);

describe("GjeldendeUnntakInfoCard", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  test("viser rolig InfoCard med nyeste unntak når gjeldende status er IKKE_AKTUELT", async () => {
    mockFetch.mockResolvedValue({
      error: null,
      data: mockOversiktDataMedUnntak,
    });

    await renderAsync(GjeldendeUnntakInfoCard({ narmesteLederId: "12345" }));

    expect(
      screen.getByText(/Ikke aktuelt med oppfølgingsplan nå/i),
    ).toBeInTheDocument();
    // Nyeste unntak: 2026-02-10, meldt av Maren Hegna.
    expect(
      screen.getByText(/Registrert 10\. februar( \d{4})? av Maren Hegna/),
    ).toBeInTheDocument();
  });

  test("rendrer ingenting når det ikke finnes gjeldende unntak", async () => {
    mockFetch.mockResolvedValue({
      error: null,
      data: mockOversiktDataEmptyWithAccess,
    });

    await renderAsync(GjeldendeUnntakInfoCard({ narmesteLederId: "12345" }));

    expect(
      screen.queryByText(/Ikke aktuelt med oppfølgingsplan nå/i),
    ).not.toBeInTheDocument();
  });

  test("rendrer ingenting når en plan gjelder, selv med unntak i historikken", async () => {
    mockFetch.mockResolvedValue({
      error: null,
      data: {
        ...mockOversiktDataOnlyActivePlan,
        oversikt: {
          ...mockOversiktDataOnlyActivePlan.oversikt,
          unntaksvurderinger:
            mockOversiktDataMedUnntak.oversikt.unntaksvurderinger,
          gjeldendeStatus: "AKTIV_PLAN",
        },
      },
    });

    await renderAsync(GjeldendeUnntakInfoCard({ narmesteLederId: "12345" }));

    expect(
      screen.queryByText(/Ikke aktuelt med oppfølgingsplan nå/i),
    ).not.toBeInTheDocument();
  });

  test("rendrer ingenting ved fetch-feil", async () => {
    mockFetch.mockResolvedValue({
      error: { type: "FETCH_NETWORK_ERROR", message: "Network error" },
      data: null,
    });

    await renderAsync(GjeldendeUnntakInfoCard({ narmesteLederId: "12345" }));

    expect(
      screen.queryByText(/Ikke aktuelt med oppfølgingsplan nå/i),
    ).not.toBeInTheDocument();
  });
});
