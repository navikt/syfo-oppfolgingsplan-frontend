import { cleanup, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import type { FerdigstiltPlanResponse } from "@/schema/ferdigstiltPlanResponseSchemas";
import { erOrgINavTiltaksgruppe } from "@/server/fetchData/arbeidsgiver/erOrgINavTiltaksgruppe";
import { fetchAktivPlanForAG } from "@/server/fetchData/arbeidsgiver/fetchAktivPlan";
import { fetchUtkastDataForAG } from "@/server/fetchData/arbeidsgiver/fetchUtkastPlan";
import { mockOrganization } from "@/server/fetchData/mockData/mockEmployeeDetails";
import { getMockFerdigstiltPlanData } from "@/server/fetchData/mockData/mockHelpers";
import { mockAktivPlanData } from "@/server/fetchData/mockData/mockPlanerData";
import { mockUtkastResponse } from "@/server/fetchData/mockData/mockUtkastData";
import { renderAsync } from "@/test/test-utils";
import AktivPlanForAG from "../AktivPlanForAG";

const MOCK_LEDER_ID = "test-leder-123";

const STANDARD_OVERSKRIFT = "Hvem vil du sende planen til";
const STANDARD_KNAPP = "Send planen";
const TILTAKSGRUPPE_OVERSKRIFT = "Del oppfølgingsplanen med fastlege og Nav";
const TILTAKSGRUPPE_KNAPP = "Del planen";

const envMock = vi.hoisted(() => ({
  tiltakspakkevurderingFeatureToggleEnabled: false,
}));

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

vi.mock("@/server/fetchData/arbeidsgiver/erOrgINavTiltaksgruppe", () => ({
  erOrgINavTiltaksgruppe: vi.fn(),
}));

vi.mock("@/env-variables/envHelpers", async () => {
  const actual = await vi.importActual<
    typeof import("@/env-variables/envHelpers")
  >("@/env-variables/envHelpers");

  return {
    ...actual,
    isTiltakspakkevurderingFeatureToggleEnabled: () =>
      envMock.tiltakspakkevurderingFeatureToggleEnabled,
  };
});

const mockFetchAktivPlan = vi.mocked(fetchAktivPlanForAG);
const mockFetchUtkast = vi.mocked(fetchUtkastDataForAG);
const mockErOrgINavTiltaksgruppe = vi.mocked(erOrgINavTiltaksgruppe);

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

describe("AktivPlanForAG og tiltakspakke-tekstene", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    envMock.tiltakspakkevurderingFeatureToggleEnabled = false;
    mockFetchAktivPlan.mockResolvedValue(lagPlanResponse());
    mockFetchUtkast.mockResolvedValue(mockUtkastResponse);
    mockErOrgINavTiltaksgruppe.mockResolvedValue(false);
  });

  afterEach(() => {
    cleanup();
  });

  test("viser dagens tekster og slår ikke opp tiltaksgruppen når feature toggle er av", async () => {
    envMock.tiltakspakkevurderingFeatureToggleEnabled = false;

    await renderAktivPlan();

    expect(
      screen.getByRole("heading", { name: STANDARD_OVERSKRIFT, level: 2 }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: STANDARD_KNAPP }),
    ).toBeInTheDocument();
    expect(mockErOrgINavTiltaksgruppe).not.toHaveBeenCalled();
  });

  test("viser dagens tekster når organisasjonen er i kontrollgruppen", async () => {
    envMock.tiltakspakkevurderingFeatureToggleEnabled = true;
    mockErOrgINavTiltaksgruppe.mockResolvedValue(false);

    await renderAktivPlan();

    expect(mockErOrgINavTiltaksgruppe).toHaveBeenCalledWith(
      mockOrganization.orgNumber,
    );
    expect(
      screen.getByRole("heading", { name: STANDARD_OVERSKRIFT, level: 2 }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: STANDARD_KNAPP }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { name: TILTAKSGRUPPE_OVERSKRIFT }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: TILTAKSGRUPPE_KNAPP }),
    ).not.toBeInTheDocument();
  });

  test("viser tekstene fra tiltakspakken når organisasjonen er i tiltaksgruppen", async () => {
    envMock.tiltakspakkevurderingFeatureToggleEnabled = true;
    mockErOrgINavTiltaksgruppe.mockResolvedValue(true);

    await renderAktivPlan();

    expect(mockErOrgINavTiltaksgruppe).toHaveBeenCalledWith(
      mockOrganization.orgNumber,
    );
    expect(
      screen.getByRole("heading", { name: TILTAKSGRUPPE_OVERSKRIFT, level: 2 }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: TILTAKSGRUPPE_KNAPP }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { name: STANDARD_OVERSKRIFT }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: STANDARD_KNAPP }),
    ).not.toBeInTheDocument();
  });

  test("slår ikke opp tiltaksgruppen når brukeren mangler redigeringstilgang", async () => {
    envMock.tiltakspakkevurderingFeatureToggleEnabled = true;
    mockErOrgINavTiltaksgruppe.mockResolvedValue(true);
    mockFetchAktivPlan.mockResolvedValue(
      lagPlanResponse({ userHasEditAccess: false }),
    );

    await renderAktivPlan();

    expect(mockErOrgINavTiltaksgruppe).not.toHaveBeenCalled();
    expect(
      screen.queryByRole("heading", { name: TILTAKSGRUPPE_OVERSKRIFT }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { name: STANDARD_OVERSKRIFT }),
    ).not.toBeInTheDocument();
  });

  test("slår ikke opp tiltaksgruppen når planen allerede er delt med begge mottakerne", async () => {
    envMock.tiltakspakkevurderingFeatureToggleEnabled = true;
    mockErOrgINavTiltaksgruppe.mockResolvedValue(true);
    mockFetchAktivPlan.mockResolvedValue(
      lagPlanResponse({
        deltMedLegeTidspunkt: "2026-01-15T10:00:00Z",
        deltMedVeilederTidspunkt: "2026-01-15T11:00:00Z",
      }),
    );

    await renderAktivPlan();

    expect(mockErOrgINavTiltaksgruppe).not.toHaveBeenCalled();
    expect(
      screen.queryByRole("heading", { name: TILTAKSGRUPPE_OVERSKRIFT }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { name: STANDARD_OVERSKRIFT }),
    ).not.toBeInTheDocument();
  });

  test("slår opp tiltaksgruppen når bare én mottaker har fått planen", async () => {
    envMock.tiltakspakkevurderingFeatureToggleEnabled = true;
    mockErOrgINavTiltaksgruppe.mockResolvedValue(true);
    mockFetchAktivPlan.mockResolvedValue(
      lagPlanResponse({ deltMedLegeTidspunkt: "2026-01-15T10:00:00Z" }),
    );

    await renderAktivPlan();

    expect(mockErOrgINavTiltaksgruppe).toHaveBeenCalledWith(
      mockOrganization.orgNumber,
    );
    expect(
      screen.getByRole("heading", { name: TILTAKSGRUPPE_OVERSKRIFT, level: 2 }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: TILTAKSGRUPPE_KNAPP }),
    ).toBeInTheDocument();
  });
});
