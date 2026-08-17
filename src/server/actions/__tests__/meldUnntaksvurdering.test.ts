import { beforeEach, describe, expect, test, vi } from "vitest";
import { FrontendErrorType } from "../FrontendErrorTypeEnum";

const tokenXFetchUpdateMock = vi.hoisted(() => vi.fn());
const refreshMock = vi.hoisted(() => vi.fn());

vi.mock("next/cache", () => ({
  refresh: refreshMock,
}));

vi.mock("@/env-variables/envHelpers", async () => {
  const actual = await vi.importActual<
    typeof import("@/env-variables/envHelpers")
  >("@/env-variables/envHelpers");

  return {
    ...actual,
    isLocalOrDemo: false,
  };
});

vi.mock("@/env-variables/serverEnv", () => ({
  getServerEnv: () => ({
    SYFO_OPPFOLGINGSPLAN_BACKEND_HOST: "http://backend",
  }),
}));

vi.mock("@/server/tokenXFetch/tokenXFetchUpdate", () => ({
  tokenXFetchUpdate: tokenXFetchUpdateMock,
}));

const { meldUnntaksvurderingServerAction } = await import(
  "../meldUnntaksvurdering"
);

describe("meldUnntaksvurderingServerAction", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("POSTer til unntaksvurdering-endepunktet og refresher oversikten ved suksess", async () => {
    tokenXFetchUpdateMock.mockResolvedValue({ error: null });

    const result = await meldUnntaksvurderingServerAction("nl-123");

    expect(tokenXFetchUpdateMock).toHaveBeenCalledWith(
      expect.objectContaining({
        method: "POST",
        endpoint:
          "http://backend/api/v1/arbeidsgiver/nl-123/unntaksvurderinger",
      }),
    );
    expect(refreshMock).toHaveBeenCalled();
    expect(result).toEqual({ error: null });
  });

  test("returnerer feilen og refresher ikke når backend avviser", async () => {
    const error = {
      type: FrontendErrorType.FETCH_UNKOWN_ERROR_RESPONSE,
      message: "Conflict",
    };
    tokenXFetchUpdateMock.mockResolvedValue({ error });

    const result = await meldUnntaksvurderingServerAction("nl-123");

    expect(result).toEqual({ error });
    expect(refreshMock).not.toHaveBeenCalled();
  });
});
