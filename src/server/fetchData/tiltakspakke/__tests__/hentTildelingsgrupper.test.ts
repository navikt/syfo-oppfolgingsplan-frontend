import { beforeEach, describe, expect, test, vi } from "vitest";
import { OPPFOLGINGSPLAN_TILTAKSPAKKE_1 } from "@/schema/flaggskipetSchemas";
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
    expect(
      await hentTildelingsgrupper(["a", "b", "c", "missing", "a"]),
    ).toEqual(
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

  test.each([
    "error",
    "empty",
    "missing_package",
  ] as const)("keeps %s unknown, not control", async (scenario) => {
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
    expect(await hentTildelingsgrupper(["a"])).toEqual(
      new Map([["a", "ukjent"]]),
    );
  });
});
