import { beforeEach, describe, expect, test, vi } from "vitest";
import { mockOversiktDataEmptyWithAccess } from "@/server/fetchData/mockData/mockOversiktDataVariants";
import { erOrgINavTiltaksgruppe } from "@/server/fetchData/tiltakspakke/erOrgINavTiltaksgruppe";
import { erNarmesteLederINavTiltaksgruppe } from "../erNarmesteLederINavTiltaksgruppe";
import { fetchOppfolgingsplanOversiktForAG } from "../fetchOppfolgingsplanOversikt";

const envMock = vi.hoisted(() => ({
  tiltakspakkevurderingFeatureToggleEnabled: false,
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

vi.mock("@/server/fetchData/tiltakspakke/erOrgINavTiltaksgruppe", () => ({
  erOrgINavTiltaksgruppe: vi.fn(),
}));

vi.mock("../fetchOppfolgingsplanOversikt", () => ({
  fetchOppfolgingsplanOversiktForAG: vi.fn(),
}));

const mockErOrgINavTiltaksgruppe = vi.mocked(erOrgINavTiltaksgruppe);
const mockFetchOppfolgingsplanOversiktForAG = vi.mocked(
  fetchOppfolgingsplanOversiktForAG,
);

describe("erNarmesteLederINavTiltaksgruppe", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    envMock.tiltakspakkevurderingFeatureToggleEnabled = false;
  });

  test("gjør Flaggskipet-vurderingen, men returnerer false når feature toggle er av", async () => {
    mockFetchOppfolgingsplanOversiktForAG.mockResolvedValue({
      error: null,
      data: mockOversiktDataEmptyWithAccess,
    });
    mockErOrgINavTiltaksgruppe.mockResolvedValue(true);

    await expect(
      erNarmesteLederINavTiltaksgruppe("narmeste-leder-id"),
    ).resolves.toBe(false);

    expect(mockFetchOppfolgingsplanOversiktForAG).toHaveBeenCalledWith(
      "narmeste-leder-id",
    );
    expect(mockErOrgINavTiltaksgruppe).toHaveBeenCalledWith("123456789");
  });

  test("returnerer false når oversikten ikke kan hentes", async () => {
    envMock.tiltakspakkevurderingFeatureToggleEnabled = true;
    mockFetchOppfolgingsplanOversiktForAG.mockResolvedValue({
      error: {
        type: "FETCH_NETWORK_ERROR",
        message: "Network error",
      },
      data: null,
    });

    await expect(
      erNarmesteLederINavTiltaksgruppe("narmeste-leder-id"),
    ).resolves.toBe(false);

    expect(mockErOrgINavTiltaksgruppe).not.toHaveBeenCalled();
  });

  test("bruker organisasjonsnummeret fra oversikten i Flaggskipet-vurderingen", async () => {
    envMock.tiltakspakkevurderingFeatureToggleEnabled = true;
    mockFetchOppfolgingsplanOversiktForAG.mockResolvedValue({
      error: null,
      data: mockOversiktDataEmptyWithAccess,
    });
    mockErOrgINavTiltaksgruppe.mockResolvedValue(true);

    await expect(
      erNarmesteLederINavTiltaksgruppe("narmeste-leder-id"),
    ).resolves.toBe(true);

    expect(mockFetchOppfolgingsplanOversiktForAG).toHaveBeenCalledWith(
      "narmeste-leder-id",
    );
    expect(mockErOrgINavTiltaksgruppe).toHaveBeenCalledWith("123456789");
  });
});
