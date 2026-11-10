import { beforeEach, expect, test, vi } from "vitest";
import { DIALOGMOTE_TILTAKSPAKKE_2 } from "@/schema/flaggskipetSchemas";
import { mockOversiktDataEmptyWithAccess } from "@/server/fetchData/mockData/mockOversiktDataVariants";
import { hentTildelingsgrupper } from "../../tiltakspakke/hentTildelingsgrupper";
import { fetchOppfolgingsplanOversiktForAG } from "../fetchOppfolgingsplanOversikt";
import { isDialogmoteTiltakspakkeActive } from "../isDialogmoteTiltakspakkeActive";

vi.mock("../fetchOppfolgingsplanOversikt", () => ({
  fetchOppfolgingsplanOversiktForAG: vi.fn(),
}));
vi.mock("../../tiltakspakke/hentTildelingsgrupper", () => ({
  hentTildelingsgrupper: vi.fn(),
}));

const orgnummer = mockOversiktDataEmptyWithAccess.organization.orgNumber;

beforeEach(() => {
  vi.clearAllMocks();
  vi.unstubAllEnvs();
  vi.mocked(fetchOppfolgingsplanOversiktForAG).mockResolvedValue({
    error: null,
    data: mockOversiktDataEmptyWithAccess,
  });
});

test("skips the lookup when the toggle is off", async () => {
  vi.stubEnv("TILTAKSPAKKE_2_FEATURE_TOGGLE", "false");
  await expect(isDialogmoteTiltakspakkeActive("leader")).resolves.toBe(false);
  expect(hentTildelingsgrupper).not.toHaveBeenCalled();
});

test("fails closed when the overview fails", async () => {
  vi.stubEnv("TILTAKSPAKKE_2_FEATURE_TOGGLE", "true");
  vi.mocked(fetchOppfolgingsplanOversiktForAG).mockResolvedValue({
    error: { type: "FETCH_NETWORK_ERROR" },
    data: null,
  });
  await expect(isDialogmoteTiltakspakkeActive("leader")).resolves.toBe(false);
  expect(hentTildelingsgrupper).not.toHaveBeenCalled();
});

test.each([
  ["tiltak", true],
  ["kontroll", false],
  ["utenfor_scope", false],
  ["ukjent", false],
] as const)(
  "is active only in the tiltaksgruppe (%s)",
  async (gruppe, expected) => {
    vi.stubEnv("TILTAKSPAKKE_2_FEATURE_TOGGLE", "true");
    vi.mocked(hentTildelingsgrupper).mockResolvedValue(
      new Map([[orgnummer, gruppe]]),
    );
    await expect(isDialogmoteTiltakspakkeActive("leader")).resolves.toBe(
      expected,
    );
    expect(hentTildelingsgrupper).toHaveBeenCalledWith(
      [orgnummer],
      DIALOGMOTE_TILTAKSPAKKE_2,
    );
  },
);
