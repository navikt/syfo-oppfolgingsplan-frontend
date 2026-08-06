import { logger } from "@navikt/next-logger";
import { afterEach, describe, expect, test, vi } from "vitest";
import { OPPFOLGINGSPLAN_TILTAKSPAKKE_1 } from "@/schema/flaggskipetSchemas";
import {
  mockFlaggskipetVurderingKontrollgruppe,
  mockFlaggskipetVurderingTiltaksgruppe,
  mockFlaggskipetVurderingUtenforScope,
} from "@/server/fetchData/mockData/mockFlaggskipetVurdering";
import { erOrgINavTiltaksgruppe } from "../erOrgINavTiltaksgruppe";
import { fetchTiltakspakkeVurdering } from "../fetchTiltakspakkeVurdering";

vi.mock("@navikt/next-logger", () => ({
  logger: {
    error: vi.fn(),
    info: vi.fn(),
  },
}));

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
const loggerInfoMock = vi.mocked(logger.info);
const loggerErrorMock = vi.mocked(logger.error);

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
    expect(loggerInfoMock).toHaveBeenCalledWith(
      {
        event_type: "flaggskipet_vurdering",
        tiltakspakkeId: OPPFOLGINGSPLAN_TILTAKSPAKKE_1,
        deltakelse: "TILTAKSGRUPPE",
        erITiltaksgruppe: true,
      },
      "flaggskipet_vurdering",
    );
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
    expect(loggerInfoMock).toHaveBeenCalledWith(
      {
        event_type: "flaggskipet_vurdering",
        tiltakspakkeId: OPPFOLGINGSPLAN_TILTAKSPAKKE_1,
        erITiltaksgruppe: false,
        errorType: "FETCH_NETWORK_ERROR",
      },
      "flaggskipet_vurdering",
    );
    expect(loggerErrorMock).not.toHaveBeenCalled();
  });

  test.each([
    "",
    "12345",
    "abcdefghi",
  ])("returns false and logs typed error event for invalid orgnummer '%s'", async (orgnummer) => {
    fetchTiltakspakkeVurderingMock.mockResolvedValue({
      error: {
        type: "SERVER_ACTION_INPUT_VALIDATION_ERROR",
      },
      data: null,
    });

    await expect(erOrgINavTiltaksgruppe(orgnummer)).resolves.toBe(false);

    expect(fetchTiltakspakkeVurderingMock).toHaveBeenCalledWith(orgnummer);
    expect(loggerInfoMock).toHaveBeenCalledWith(
      {
        event_type: "flaggskipet_vurdering",
        tiltakspakkeId: OPPFOLGINGSPLAN_TILTAKSPAKKE_1,
        erITiltaksgruppe: false,
        errorType: "SERVER_ACTION_INPUT_VALIDATION_ERROR",
      },
      "flaggskipet_vurdering",
    );
    expect(loggerErrorMock).not.toHaveBeenCalled();
  });
});
