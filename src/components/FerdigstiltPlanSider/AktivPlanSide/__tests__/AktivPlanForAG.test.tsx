import { cleanup, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import type { FerdigstiltPlanResponse } from "@/schema/ferdigstiltPlanResponseSchemas";
import { fetchAktivPlanForAG } from "@/server/fetchData/arbeidsgiver/fetchAktivPlan";
import { fetchUtkastDataForAG } from "@/server/fetchData/arbeidsgiver/fetchUtkastPlan";
import { getMockFerdigstiltPlanData } from "@/server/fetchData/mockData/mockHelpers";
import { mockAktivPlanData } from "@/server/fetchData/mockData/mockPlanerData";
import { mockUtkastResponse } from "@/server/fetchData/mockData/mockUtkastData";
import { renderAsync } from "@/test/test-utils";
import AktivPlanForAG from "../AktivPlanForAG";

const MOCK_LEDER_ID = "test-leder-123";

const DELING_OVERSKRIFT = "Del oppfølgingsplanen med fastlege og Nav";
const DELING_KNAPP = "Del planen";

vi.mock("next/navigation", async () => {
  const { mockNextNavigation } = await import(
    "@/test/mocks/nextNavigationMock"
  );

  return mockNextNavigation();
});

vi.mock("@/server/fetchData/arbeidsgiver/fetchAktivPlan", () => ({
  fetchAktivPlanForAG: vi.fn(),
}));

vi.mock("@/server/fetchData/arbeidsgiver/fetchUtkastPlan", () => ({
  fetchUtkastDataForAG: vi.fn(),
}));

const mockFetchAktivPlan = vi.mocked(fetchAktivPlanForAG);
const mockFetchUtkast = vi.mocked(fetchUtkastDataForAG);

function lagPlanResponse({
  userHasEditAccess = true,
  deltMedLegeTidspunkt = null,
  deltMedVeilederTidspunkt = null,
}: {
  userHasEditAccess?: boolean;
  deltMedLegeTidspunkt?: string | null;
  deltMedVeilederTidspunkt?: string | null;
} = {}): FerdigstiltPlanResponse {
  const basePlan = getMockFerdigstiltPlanData(mockAktivPlanData.id);

  return {
    ...basePlan,
    userHasEditAccess,
    oppfolgingsplan: {
      ...basePlan.oppfolgingsplan,
      deltMedLegeTidspunkt,
      deltMedVeilederTidspunkt,
    },
  };
}

function renderAktivPlan() {
  return renderAsync(
    AktivPlanForAG({
      narmesteLederId: MOCK_LEDER_ID,
      nyligOpprettet: false,
    }),
  );
}

describe("AktivPlanForAG og delingsboksen", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockFetchAktivPlan.mockResolvedValue(lagPlanResponse());
    mockFetchUtkast.mockResolvedValue(mockUtkastResponse);
  });

  afterEach(() => {
    cleanup();
  });

  test("viser tekstene fra tiltakspakken når planen ikke er delt", async () => {
    await renderAktivPlan();

    expect(
      screen.getByRole("heading", { name: DELING_OVERSKRIFT, level: 2 }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: DELING_KNAPP }),
    ).toBeInTheDocument();
  });

  test("skjuler delingsboksen når brukeren mangler redigeringstilgang", async () => {
    mockFetchAktivPlan.mockResolvedValue(
      lagPlanResponse({ userHasEditAccess: false }),
    );

    await renderAktivPlan();

    expect(
      screen.queryByRole("heading", { name: DELING_OVERSKRIFT }),
    ).not.toBeInTheDocument();
  });

  test("skjuler delingsboksen når planen allerede er delt med begge mottakerne", async () => {
    mockFetchAktivPlan.mockResolvedValue(
      lagPlanResponse({
        deltMedLegeTidspunkt: "2026-01-15T10:00:00Z",
        deltMedVeilederTidspunkt: "2026-01-15T11:00:00Z",
      }),
    );

    await renderAktivPlan();

    expect(
      screen.queryByRole("heading", { name: DELING_OVERSKRIFT }),
    ).not.toBeInTheDocument();
  });
});
