import { cleanup, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import PlanListeForSykmeldt from "@/components/OversiktSide/PlanListe/PlanListeForSykmeldt";
import {
  mockOversiktDataMedPlanerForSM,
  mockOversiktDataOnlyActiveForSM,
  mockOversiktDataTomForSM,
} from "@/server/fetchData/mockData/mockOversiktData";
import { fetchOppfolgingsplanOversiktForSM } from "@/server/fetchData/sykmeldt/fetchOppfolgingsplanOversiktForSM";
import { renderAsync } from "@/test/test-utils";

vi.mock(
  "@/server/fetchData/sykmeldt/fetchOppfolgingsplanOversiktForSM",
  () => ({
    fetchOppfolgingsplanOversiktForSM: vi.fn(),
  }),
);

vi.mock("next/navigation", async () => {
  const { mockNextNavigation } = await import(
    "@/test/mocks/nextNavigationMock"
  );

  return mockNextNavigation();
});

const mockFetch = vi.mocked(fetchOppfolgingsplanOversiktForSM);

describe("PlanListeForSykmeldt", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  test("displays new 6-month SM text for previous plans section", async () => {
    mockFetch.mockResolvedValue(mockOversiktDataMedPlanerForSM);

    await renderAsync(PlanListeForSykmeldt());

    expect(
      screen.getByText(
        /Aktive og tidligere oppfølgingsplaner blir utilgjengelige når du ikke har hatt sykmelding hos arbeidsgiveren på 6 måneder/,
      ),
    ).toBeInTheDocument();
  });

  test("does not display old 4-month/friskmeldt text", async () => {
    mockFetch.mockResolvedValue(mockOversiktDataMedPlanerForSM);

    await renderAsync(PlanListeForSykmeldt());

    expect(
      screen.queryByText(
        /Tidligere planer er tilgjengelige i 4 måneder etter at du er friskmeldt/,
      ),
    ).not.toBeInTheDocument();
  });

  test("does not display previous plans text when no previous plans", async () => {
    mockFetch.mockResolvedValue(mockOversiktDataTomForSM);

    await renderAsync(PlanListeForSykmeldt());

    expect(
      screen.queryByText(/oppfølgingsplaner blir utilgjengelige/),
    ).not.toBeInTheDocument();
  });

  test("displays 6-month SM text when only active plans exist (no previous plans)", async () => {
    mockFetch.mockResolvedValue(mockOversiktDataOnlyActiveForSM);

    await renderAsync(PlanListeForSykmeldt());

    expect(
      screen.getByText(
        /Aktive og tidligere oppfølgingsplaner blir utilgjengelige når du ikke har hatt sykmelding hos arbeidsgiveren på 6 måneder/,
      ),
    ).toBeInTheDocument();
  });

  test("displays 6-month SM text exactly once when both active and previous plans exist", async () => {
    mockFetch.mockResolvedValue(mockOversiktDataMedPlanerForSM);

    await renderAsync(PlanListeForSykmeldt());

    const matches = screen.getAllByText(
      /Aktive og tidligere oppfølgingsplaner blir utilgjengelige når du ikke har hatt sykmelding hos arbeidsgiveren på 6 måneder/,
    );
    expect(matches).toHaveLength(1);
  });
});
