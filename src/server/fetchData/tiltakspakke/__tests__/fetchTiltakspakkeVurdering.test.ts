import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { RuntimeErrorEvent } from "@/common/runtimeErrorEvent";
import { mockFlaggskipetVurderingTiltaksgruppe } from "@/server/fetchData/mockData/mockFlaggskipetVurdering";

const tokenXFetchUpdateWithResponseMock = vi.hoisted(() => vi.fn());

vi.mock("@/server/tokenXFetch/tokenXFetchUpdate", () => ({
  tokenXFetchUpdateWithResponse: tokenXFetchUpdateWithResponseMock,
}));

const flaggskipetHost = "http://flaggskipet";
const endpoint = `${flaggskipetHost}/api/v1/tiltakspakker/vurdering`;

async function importFetcher({ isLocalOrDemo }: { isLocalOrDemo: boolean }) {
  vi.resetModules();
  vi.doMock("@/env-variables/envHelpers", async () => {
    const actual = await vi.importActual<
      typeof import("@/env-variables/envHelpers")
    >("@/env-variables/envHelpers");

    return {
      ...actual,
      isLocalOrDemo,
    };
  });
  vi.doMock("@/env-variables/serverEnv", () => ({
    getServerEnv: () => ({
      FLAGGSKIPET_HOST: flaggskipetHost,
    }),
  }));

  return await import("../fetchTiltakspakkeVurdering");
}

describe("fetchTiltakspakkeVurdering", () => {
  beforeEach(() => {
    tokenXFetchUpdateWithResponseMock.mockReset();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
    vi.restoreAllMocks();
    vi.resetModules();
    vi.doUnmock("@/env-variables/envHelpers");
    vi.doUnmock("@/env-variables/serverEnv");
  });

  test("delegates valid orgnummer to tokenXFetchUpdateWithResponse with Flaggskipet target and 5-second timeout", async () => {
    const timeoutSpy = vi.spyOn(AbortSignal, "timeout");
    tokenXFetchUpdateWithResponseMock.mockResolvedValue({
      error: null,
      data: mockFlaggskipetVurderingTiltaksgruppe,
    });
    const { fetchTiltakspakkeVurdering } = await importFetcher({
      isLocalOrDemo: false,
    });

    const result = await fetchTiltakspakkeVurdering(["123456789"]);

    expect(result).toEqual({
      error: null,
      data: mockFlaggskipetVurderingTiltaksgruppe,
    });
    expect(tokenXFetchUpdateWithResponseMock).toHaveBeenCalledOnce();

    const request = tokenXFetchUpdateWithResponseMock.mock.calls[0]?.[0];

    expect(request).toMatchObject({
      eventType: RuntimeErrorEvent.TILTAKSPAKKEVURDERING_FETCH_FAILED,
      targetApi: "FLAGGSKIPET",
      endpoint,
      requestBody: {
        orgnumre: ["123456789"],
      },
    });
    expect(
      request.responseDataSchema.safeParse(
        mockFlaggskipetVurderingTiltaksgruppe,
      ).success,
    ).toBe(true);
    expect(timeoutSpy).toHaveBeenCalledWith(5000);
    expect(request.signal).toBeInstanceOf(AbortSignal);
    expect(request.signal).toBe(timeoutSpy.mock.results[0]?.value);
  });

  test("returns the delegated error result unchanged", async () => {
    tokenXFetchUpdateWithResponseMock.mockResolvedValue({
      error: {
        type: "FETCH_NETWORK_ERROR",
      },
      data: null,
    });
    const { fetchTiltakspakkeVurdering } = await importFetcher({
      isLocalOrDemo: false,
    });

    const result = await fetchTiltakspakkeVurdering(["123456789"]);

    expect(result).toEqual({
      error: {
        type: "FETCH_NETWORK_ERROR",
      },
      data: null,
    });
  });

  test("delegates malformed orgnummer to Flaggskipet wrapper", async () => {
    tokenXFetchUpdateWithResponseMock.mockResolvedValue({
      error: {
        type: "BAD_REQUEST",
      },
      data: null,
    });
    const { fetchTiltakspakkeVurdering } = await importFetcher({
      isLocalOrDemo: false,
    });

    const result = await fetchTiltakspakkeVurdering(["abc"]);

    expect(tokenXFetchUpdateWithResponseMock).toHaveBeenCalledOnce();
    expect(tokenXFetchUpdateWithResponseMock).toHaveBeenCalledWith(
      expect.objectContaining({
        requestBody: {
          orgnumre: ["abc"],
        },
      }),
    );
    expect(result).toEqual({
      error: {
        type: "BAD_REQUEST",
      },
      data: null,
    });
  });

  test("returns mock data in local or demo without calling Flaggskipet", async () => {
    const { fetchTiltakspakkeVurdering } = await importFetcher({
      isLocalOrDemo: true,
    });

    const result = await fetchTiltakspakkeVurdering(["123456789"]);

    expect(tokenXFetchUpdateWithResponseMock).not.toHaveBeenCalled();
    expect(result).toEqual({
      error: null,
      data: mockFlaggskipetVurderingTiltaksgruppe,
    });
  });
});
