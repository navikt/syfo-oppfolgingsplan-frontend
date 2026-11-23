import { beforeEach, describe, expect, test, vi } from "vitest";
import {
  DIALOGMOTE_TILTAKSPAKKE_2,
  OPPFOLGINGSPLAN_TILTAKSPAKKE_1,
} from "@/schema/flaggskipetSchemas";
import type { Tildelingsgruppe } from "@/schema/tiltakspakkeContext";
import { mockOversiktDataEmptyWithAccess } from "@/server/fetchData/mockData/mockOversiktDataVariants";
import { hentTildelingsgrupper } from "@/server/fetchData/tiltakspakke/hentTildelingsgrupper";
import { erNarmesteLederINavTiltaksgruppe } from "../erNarmesteLederINavTiltaksgruppe";
import { fetchOppfolgingsplanOversiktForAG } from "../fetchOppfolgingsplanOversikt";
import { hentTiltakspakkeContext } from "../hentTiltakspakkeContext";

const envMock = vi.hoisted(() => ({ enabled: false, tiltakspakke2: false }));
vi.mock("@/env-variables/envHelpers", () => ({
  isTiltakspakkevurderingFeatureToggleEnabled: () => envMock.enabled,
  isDialogmoteTiltakspakkeFeatureToggleEnabled: () => envMock.tiltakspakke2,
}));
vi.mock("@/server/fetchData/tiltakspakke/hentTildelingsgrupper", () => ({
  hentTildelingsgrupper: vi.fn(),
}));
vi.mock("../fetchOppfolgingsplanOversikt", () => ({
  fetchOppfolgingsplanOversiktForAG: vi.fn(),
}));

const orgnummer = "123456789";
function mockTildelinger(
  pakke1: Tildelingsgruppe,
  pakke2: Tildelingsgruppe = "ukjent",
) {
  vi.mocked(hentTildelingsgrupper).mockResolvedValue({
    [OPPFOLGINGSPLAN_TILTAKSPAKKE_1]: new Map([[orgnummer, pakke1]]),
    [DIALOGMOTE_TILTAKSPAKKE_2]: new Map([[orgnummer, pakke2]]),
  });
}

describe("leader assignment and delivery", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    envMock.enabled = true;
    envMock.tiltakspakke2 = false;
    vi.mocked(fetchOppfolgingsplanOversiktForAG).mockResolvedValue({
      error: null,
      data: mockOversiktDataEmptyWithAccess,
    });
  });

  test.each(["tiltak", "kontroll", "utenfor_scope", "ukjent"] as const)(
    "preserves %s while only treatment opens the UI",
    async (gruppe) => {
      mockTildelinger(gruppe);
      await expect(hentTiltakspakkeContext("leader")).resolves.toEqual({
        gruppe,
        isOppfolgingsplanTiltakspakkeActive: gruppe === "tiltak",
        isDialogmoteTiltakspakkeActive: false,
      });
      expect(hentTildelingsgrupper).toHaveBeenCalledExactlyOnceWith([
        orgnummer,
      ]);
    },
  );

  test("hides tiltakspakke 2 when its toggle is off", async () => {
    mockTildelinger("kontroll", "tiltak");
    await expect(hentTiltakspakkeContext("leader")).resolves.toMatchObject({
      isDialogmoteTiltakspakkeActive: false,
    });
  });

  test("keeps treatment assignment with the toggle off", async () => {
    envMock.enabled = false;
    mockTildelinger("tiltak");
    await expect(hentTiltakspakkeContext("leader")).resolves.toEqual({
      gruppe: "tiltak",
      isOppfolgingsplanTiltakspakkeActive: false,
      isDialogmoteTiltakspakkeActive: false,
    });
    expect(hentTildelingsgrupper).toHaveBeenCalledOnce();
  });

  test.each([
    ["tiltak", true],
    ["kontroll", false],
    ["utenfor_scope", false],
    ["ukjent", false],
  ] as const)(
    "reads tiltakspakke 2 (%s) from the same lookup",
    async (pakke2, expected) => {
      envMock.tiltakspakke2 = true;
      mockTildelinger("kontroll", pakke2);
      await expect(hentTiltakspakkeContext("leader")).resolves.toEqual({
        gruppe: "kontroll",
        isOppfolgingsplanTiltakspakkeActive: false,
        isDialogmoteTiltakspakkeActive: expected,
      });
    },
  );

  test("fails closed without an extra lookup when the overview fails", async () => {
    envMock.tiltakspakke2 = true;
    vi.mocked(fetchOppfolgingsplanOversiktForAG).mockResolvedValue({
      error: { type: "FETCH_NETWORK_ERROR" },
      data: null,
    });
    await expect(hentTiltakspakkeContext("leader")).resolves.toEqual({
      gruppe: "ukjent",
      isOppfolgingsplanTiltakspakkeActive: false,
      isDialogmoteTiltakspakkeActive: false,
    });
    expect(hentTildelingsgrupper).not.toHaveBeenCalled();
  });

  test.each([true, false])(
    "preserves the existing boolean API with toggle %s",
    async (enabled) => {
      envMock.enabled = enabled;
      mockTildelinger("tiltak");
      await expect(erNarmesteLederINavTiltaksgruppe("leader")).resolves.toBe(
        enabled,
      );
      expect(fetchOppfolgingsplanOversiktForAG).toHaveBeenCalledWith("leader");
      expect(hentTildelingsgrupper).toHaveBeenCalledOnce();
    },
  );
});
