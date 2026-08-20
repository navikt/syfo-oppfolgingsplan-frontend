import { logger } from "@navikt/next-logger";
import { afterEach, describe, expect, test, vi } from "vitest";
import { OPPFOLGINGSPLAN_TILTAKSPAKKE_1 } from "@/schema/flaggskipetSchemas";
import { fetchTiltakspakkeVurdering } from "../fetchTiltakspakkeVurdering";
import { finnOrganisasjonerITiltaksgruppe } from "../finnOrganisasjonerITiltaksgruppe";

vi.mock("@navikt/next-logger", () => ({
  logger: { info: vi.fn() },
}));

vi.mock("../fetchTiltakspakkeVurdering", () => ({
  fetchTiltakspakkeVurdering: vi.fn(),
}));

const fetchTiltakspakkeVurderingMock = vi.mocked(fetchTiltakspakkeVurdering);
const loggerInfoMock = vi.mocked(logger.info);

describe("finnOrganisasjonerITiltaksgruppe", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  test("batches unique organizations and returns only TILTAKSGRUPPE", async () => {
    fetchTiltakspakkeVurderingMock.mockResolvedValue({
      error: null,
      data: [
        {
          tiltakspakkeId: OPPFOLGINGSPLAN_TILTAKSPAKKE_1,
          virksomheter: [
            { orgnummer: "111111111", deltakelse: "TILTAKSGRUPPE" },
            { orgnummer: "222222222", deltakelse: "KONTROLLGRUPPE" },
            { orgnummer: "333333333", deltakelse: "TILTAKSGRUPPE" },
          ],
        },
      ],
    });

    const result = await finnOrganisasjonerITiltaksgruppe([
      "111111111",
      "222222222",
      "111111111",
    ]);

    expect(fetchTiltakspakkeVurderingMock).toHaveBeenCalledOnce();
    expect(fetchTiltakspakkeVurderingMock).toHaveBeenCalledWith([
      "111111111",
      "222222222",
    ]);
    expect([...result]).toEqual(["111111111"]);
  });

  test("does not call Flaggskipet for an empty organization list", async () => {
    await expect(finnOrganisasjonerITiltaksgruppe([])).resolves.toEqual(
      new Set(),
    );
    expect(fetchTiltakspakkeVurderingMock).not.toHaveBeenCalled();
  });

  test("fails closed and logs a typed event on Flaggskipet error", async () => {
    fetchTiltakspakkeVurderingMock.mockResolvedValue({
      error: { type: "FETCH_NETWORK_ERROR" },
      data: null,
    });

    await expect(
      finnOrganisasjonerITiltaksgruppe(["111111111", "222222222"]),
    ).resolves.toEqual(new Set());
    expect(loggerInfoMock).toHaveBeenCalledWith(
      {
        event_type: "flaggskipet_vurdering",
        tiltakspakkeId: OPPFOLGINGSPLAN_TILTAKSPAKKE_1,
        antallVirksomheter: 2,
        errorType: "FETCH_NETWORK_ERROR",
      },
      "flaggskipet_vurdering",
    );
  });
});
