import { logger } from "@navikt/next-logger";
import { beforeEach, describe, expect, test, vi } from "vitest";
import {
  DIALOGMOTE_TILTAKSPAKKE_2,
  OPPFOLGINGSPLAN_TILTAKSPAKKE_1,
} from "@/schema/flaggskipetSchemas";
import { fetchTiltakspakkeVurdering } from "../fetchTiltakspakkeVurdering";
import { hentTildelingsgrupper } from "../hentTildelingsgrupper";

vi.mock("@navikt/next-logger", () => ({ logger: { info: vi.fn() } }));
vi.mock("../fetchTiltakspakkeVurdering", () => ({
  fetchTiltakspakkeVurdering: vi.fn(),
}));
const fetchVurdering = vi.mocked(fetchTiltakspakkeVurdering);

describe("assignment categories from the existing lookup", () => {
  beforeEach(() => vi.clearAllMocks());

  test("retains all requested groups, excluding unrelated organisations and packages", async () => {
    fetchVurdering.mockResolvedValue({
      error: null,
      data: [
        {
          tiltakspakkeId: "another-package",
          virksomheter: [{ orgnummer: "missing", deltakelse: "TILTAKSGRUPPE" }],
        },
        {
          tiltakspakkeId: OPPFOLGINGSPLAN_TILTAKSPAKKE_1,
          virksomheter: [
            { orgnummer: "a", deltakelse: "TILTAKSGRUPPE" },
            { orgnummer: "b", deltakelse: "KONTROLLGRUPPE" },
            { orgnummer: "c", deltakelse: "UTENFOR_SCOPE" },
            { orgnummer: "unrequested", deltakelse: "TILTAKSGRUPPE" },
          ],
        },
      ],
    });
    const tildelinger = await hentTildelingsgrupper([
      "a",
      "b",
      "c",
      "missing",
      "a",
    ]);
    expect(tildelinger[OPPFOLGINGSPLAN_TILTAKSPAKKE_1]).toEqual(
      new Map([
        ["a", "tiltak"],
        ["b", "kontroll"],
        ["c", "utenfor_scope"],
        ["missing", "ukjent"],
      ]),
    );
    expect(fetchVurdering).toHaveBeenCalledExactlyOnceWith([
      "a",
      "b",
      "c",
      "missing",
    ]);
  });

  test.each(["error", "empty", "missing_package"] as const)(
    "keeps %s unknown, not control",
    async (scenario) => {
      fetchVurdering.mockResolvedValue(
        scenario === "error"
          ? { error: { type: "FETCH_NETWORK_ERROR" }, data: null }
          : {
              error: null,
              data:
                scenario === "empty"
                  ? []
                  : [{ tiltakspakkeId: "another-package", virksomheter: [] }],
            },
      );
      const tildelinger = await hentTildelingsgrupper(["a"]);
      expect(tildelinger[OPPFOLGINGSPLAN_TILTAKSPAKKE_1]).toEqual(
        new Map([["a", "ukjent"]]),
      );
    },
  );

  test("logs a fail-closed outcome per known tiltakspakke", async () => {
    fetchVurdering.mockResolvedValue({
      error: { type: "FETCH_NETWORK_ERROR" },
      data: null,
    });
    const tildelinger = await hentTildelingsgrupper(["a"]);
    expect(tildelinger[DIALOGMOTE_TILTAKSPAKKE_2]).toEqual(
      new Map([["a", "ukjent"]]),
    );
    expect(vi.mocked(logger.info).mock.calls.map(([fields]) => fields)).toEqual(
      [OPPFOLGINGSPLAN_TILTAKSPAKKE_1, DIALOGMOTE_TILTAKSPAKKE_2].map(
        (tiltakspakkeId) =>
          expect.objectContaining({
            tiltakspakkeId,
            errorType: "FETCH_NETWORK_ERROR",
          }),
      ),
    );
  });

  test("reads every known tiltakspakke from one call", async () => {
    fetchVurdering.mockResolvedValue({
      error: null,
      data: [
        {
          tiltakspakkeId: OPPFOLGINGSPLAN_TILTAKSPAKKE_1,
          virksomheter: [{ orgnummer: "a", deltakelse: "KONTROLLGRUPPE" }],
        },
        {
          tiltakspakkeId: DIALOGMOTE_TILTAKSPAKKE_2,
          virksomheter: [{ orgnummer: "a", deltakelse: "TILTAKSGRUPPE" }],
        },
      ],
    });
    const tildelinger = await hentTildelingsgrupper(["a"]);
    expect(tildelinger).toEqual({
      [OPPFOLGINGSPLAN_TILTAKSPAKKE_1]: new Map([["a", "kontroll"]]),
      [DIALOGMOTE_TILTAKSPAKKE_2]: new Map([["a", "tiltak"]]),
    });
    expect(fetchVurdering).toHaveBeenCalledOnce();
  });
});
