import { beforeEach, describe, expect, test, vi } from "vitest";
import { mockOversiktDataEmptyWithAccess } from "@/server/fetchData/mockData/mockOversiktDataVariants";
import { hentTildelingsgrupper } from "@/server/fetchData/tiltakspakke/hentTildelingsgrupper";
import { erNarmesteLederINavTiltaksgruppe } from "../erNarmesteLederINavTiltaksgruppe";
import { fetchOppfolgingsplanOversiktForAG } from "../fetchOppfolgingsplanOversikt";
import { hentTiltakspakkeContext } from "../hentTiltakspakkeContext";

const envMock = vi.hoisted(() => ({ enabled: false }));
vi.mock("@/env-variables/envHelpers", () => ({
  isTiltakspakkevurderingFeatureToggleEnabled: () => envMock.enabled,
}));
vi.mock("@/server/fetchData/tiltakspakke/hentTildelingsgrupper", () => ({
  hentTildelingsgrupper: vi.fn(),
}));
vi.mock("../fetchOppfolgingsplanOversikt", () => ({
  fetchOppfolgingsplanOversiktForAG: vi.fn(),
}));

describe("leader assignment and delivery", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    envMock.enabled = true;
    vi.mocked(fetchOppfolgingsplanOversiktForAG).mockResolvedValue({
      error: null,
      data: mockOversiktDataEmptyWithAccess,
    });
  });

  test.each([
    "tiltak",
    "kontroll",
    "utenfor_scope",
    "ukjent",
  ] as const)("preserves %s while only treatment opens the UI", async (gruppe) => {
    vi.mocked(hentTildelingsgrupper).mockResolvedValue(
      new Map([["123456789", gruppe]]),
    );
    await expect(hentTiltakspakkeContext("leader")).resolves.toEqual({
      gruppe,
      erITiltaksgruppe: gruppe === "tiltak",
    });
    expect(hentTildelingsgrupper).toHaveBeenCalledExactlyOnceWith([
      "123456789",
    ]);
  });

  test("keeps treatment assignment with the toggle off", async () => {
    envMock.enabled = false;
    vi.mocked(hentTildelingsgrupper).mockResolvedValue(
      new Map([["123456789", "tiltak"]]),
    );
    await expect(hentTiltakspakkeContext("leader")).resolves.toEqual({
      gruppe: "tiltak",
      erITiltaksgruppe: false,
    });
    expect(hentTildelingsgrupper).toHaveBeenCalledOnce();
  });

  test("fails closed without an extra lookup when the overview fails", async () => {
    vi.mocked(fetchOppfolgingsplanOversiktForAG).mockResolvedValue({
      error: { type: "FETCH_NETWORK_ERROR" },
      data: null,
    });
    await expect(hentTiltakspakkeContext("leader")).resolves.toEqual({
      gruppe: "ukjent",
      erITiltaksgruppe: false,
    });
    expect(hentTildelingsgrupper).not.toHaveBeenCalled();
  });

  test.each([
    true,
    false,
  ])("preserves the existing boolean API with toggle %s", async (enabled) => {
    envMock.enabled = enabled;
    vi.mocked(hentTildelingsgrupper).mockResolvedValue(
      new Map([["123456789", "tiltak"]]),
    );
    await expect(erNarmesteLederINavTiltaksgruppe("leader")).resolves.toBe(
      enabled,
    );
    expect(fetchOppfolgingsplanOversiktForAG).toHaveBeenCalledWith("leader");
    expect(hentTildelingsgrupper).toHaveBeenCalledExactlyOnceWith([
      "123456789",
    ]);
  });
});
