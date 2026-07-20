import { afterEach, describe, expect, test, vi } from "vitest";
import { OPPFOLGINGSPLAN_TILTAKSPAKKE_1 } from "@/schema/flaggskipetSchemas";
import {
  mockFlaggskipetVurderingKontrollgruppe,
  mockFlaggskipetVurderingTiltaksgruppe,
  mockFlaggskipetVurderingUtenforScope,
} from "@/server/fetchData/mockData/mockFlaggskipetVurdering";
import { erOrgINavTiltaksgruppe } from "../erOrgINavTiltaksgruppe";
import { fetchTiltakspakkeVurdering } from "../fetchTiltakspakkeVurdering";

vi.mock("../fetchTiltakspakkeVurdering", async () => {
  const actual = await vi.importActual<
    typeof import("../fetchTiltakspakkeVurdering")
  >("../fetchTiltakspakkeVurdering");

  return {
    ...actual,
    fetchTiltakspakkeVurdering: vi.fn(),
  };
});

const fetchTiltakspakkeVurderingMock = vi.mocked(fetchTiltakspakkeVurdering);

describe("erOrgINavTiltaksgruppe", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  test("returns true for TILTAKSGRUPPE", async () => {
    fetchTiltakspakkeVurderingMock.mockResolvedValue({
      error: null,
      data: mockFlaggskipetVurderingTiltaksgruppe,
    });

    await expect(erOrgINavTiltaksgruppe("123456789")).resolves.toBe(true);
  });

  test("returns false for KONTROLLGRUPPE", async () => {
    fetchTiltakspakkeVurderingMock.mockResolvedValue({
      error: null,
      data: mockFlaggskipetVurderingKontrollgruppe,
    });

    await expect(erOrgINavTiltaksgruppe("123456789")).resolves.toBe(false);
  });

  test("returns false for UTENFOR_SCOPE", async () => {
    fetchTiltakspakkeVurderingMock.mockResolvedValue({
      error: null,
      data: mockFlaggskipetVurderingUtenforScope,
    });

    await expect(erOrgINavTiltaksgruppe("123456789")).resolves.toBe(false);
  });

  test("returns false when OPPFOLGINGSPLAN_TILTAKSPAKKE_1 is missing", async () => {
    fetchTiltakspakkeVurderingMock.mockResolvedValue({
      error: null,
      data: [
        {
          tiltakspakkeId: "ANNEN_TILTAKSPAKKE",
          virksomheter: [
            {
              orgnummer: "123456789",
              deltakelse: "TILTAKSGRUPPE",
            },
          ],
        },
      ],
    });

    await expect(erOrgINavTiltaksgruppe("123456789")).resolves.toBe(false);
  });

  test("returns false when orgnummer is missing from the target tiltakspakke", async () => {
    fetchTiltakspakkeVurderingMock.mockResolvedValue({
      error: null,
      data: [
        {
          tiltakspakkeId: OPPFOLGINGSPLAN_TILTAKSPAKKE_1,
          virksomheter: [
            {
              orgnummer: "987654321",
              deltakelse: "TILTAKSGRUPPE",
            },
          ],
        },
      ],
    });

    await expect(erOrgINavTiltaksgruppe("123456789")).resolves.toBe(false);
  });

  test("returns false on Flaggskipet error", async () => {
    fetchTiltakspakkeVurderingMock.mockResolvedValue({
      error: {
        type: "FETCH_NETWORK_ERROR",
      },
      data: null,
    });

    await expect(erOrgINavTiltaksgruppe("123456789")).resolves.toBe(false);
  });

  test.each([
    "",
    "12345",
    "abcdefghi",
  ])("returns false without calling fetcher for invalid orgnummer '%s'", async (orgnummer) => {
    await expect(erOrgINavTiltaksgruppe(orgnummer)).resolves.toBe(false);

    expect(fetchTiltakspakkeVurderingMock).not.toHaveBeenCalled();
  });
});
