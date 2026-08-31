import { describe, expect, it } from "vitest";
import {
  browserApmOptions,
  normalizeBrowserPath,
  sanitizeBrowserTelemetry,
} from "./browser";

const leaderId = "11111111-1111-4111-8111-111111111111";
const planId = "22222222-2222-4222-8222-222222222222";

describe("browser-observability", () => {
  it.each([
    [
      `/syk/oppfolgingsplan/${leaderId}`,
      "/syk/oppfolgingsplan/{narmesteLederId}",
    ],
    [`/${leaderId}/ny-plan`, "/syk/oppfolgingsplan/{narmesteLederId}/ny-plan"],
    [
      `/${leaderId}/aktiv-plan`,
      "/syk/oppfolgingsplan/{narmesteLederId}/aktiv-plan",
    ],
    [
      `/${leaderId}/tidligere-planer/${planId}?token=hemmelig`,
      "/syk/oppfolgingsplan/{narmesteLederId}/tidligere-planer/{planId}",
    ],
    ["/sykmeldt", "/syk/oppfolgingsplan/sykmeldt"],
    [
      `/sykmeldt/aktiv-plan/${planId}`,
      "/syk/oppfolgingsplan/sykmeldt/aktiv-plan/{planId}",
    ],
    [
      `/sykmeldt/tidligere-planer/${planId}`,
      "/syk/oppfolgingsplan/sykmeldt/tidligere-planer/{planId}",
    ],
  ])("normaliserer page ID for %s", (path, expected) => {
    expect(normalizeBrowserPath(path)).toBe(expected);
  });

  it("samler ukjente ruter i én bounded fallback", () => {
    expect(normalizeBrowserPath(`/ukjent/${leaderId}/${planId}`)).toBe(
      "/syk/oppfolgingsplan/{unknown}",
    );
  });

  it("fjerner bruker, query og dynamiske ID-er fra telemetry", () => {
    const item = {
      type: "exception",
      payload: {
        value: `Kunne ikke hente plan ${planId}`,
        context: { leaderId },
        stacktrace: {
          frames: [
            {
              filename:
                "https://www.nav.no/_next/static/chunks/app/[planId]/page.js",
            },
          ],
        },
      },
      meta: {
        user: { id: "skal-ikke-sendes" },
        page: {
          url: `https://www.nav.no/syk/oppfolgingsplan/${leaderId}/aktiv-plan?fnr=01010112345`,
        },
      },
    } as Parameters<typeof sanitizeBrowserTelemetry>[0];

    const sanitized = sanitizeBrowserTelemetry(item);

    expect(sanitized?.meta.user).toBeUndefined();
    expect(sanitized).toMatchObject({
      payload: {
        value: "Kunne ikke hente plan [uuid]",
        context: { leaderId: "[uuid]" },
        stacktrace: {
          frames: [
            {
              filename:
                "https://www.nav.no/_next/static/chunks/app/[planId]/page.js",
            },
          ],
        },
      },
      meta: {
        page: {
          id: "/syk/oppfolgingsplan/{narmesteLederId}/aktiv-plan",
          url: "https://www.nav.no/syk/oppfolgingsplan/{narmesteLederId}/aktiv-plan",
        },
      },
    });
  });

  it("bevarer OTLP-strukturen og fjerner URL-detaljer fra dype trace-attributter", () => {
    const item = {
      type: "trace",
      payload: {
        resourceSpans: [
          {
            scopeSpans: [
              {
                spans: [
                  {
                    attributes: [
                      {
                        key: "url.full",
                        value: {
                          stringValue: `https://www.nav.no/api/${leaderId}?opaque=syntetisk-query-canary#fragment-canary`,
                        },
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
      meta: {},
    } as Parameters<typeof sanitizeBrowserTelemetry>[0];

    expect(sanitizeBrowserTelemetry(item)).toMatchObject({
      payload: {
        resourceSpans: [
          {
            scopeSpans: [
              {
                spans: [
                  {
                    attributes: [
                      {
                        key: "url.full",
                        value: {
                          stringValue: "https://www.nav.no/api/[uuid]",
                        },
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
    });
  });

  it("fjerner query og fragment fra URL-er i tekst og relative URL-felter", () => {
    const item = {
      type: "exception",
      payload: {
        message:
          "Kall mot https://www.nav.no/api/plan?opaque=hemmelig#respons feilet",
        requestUrl: `/api/${planId}?opaque=hemmelig#respons`,
      },
      meta: {},
    } as Parameters<typeof sanitizeBrowserTelemetry>[0];

    expect(sanitizeBrowserTelemetry(item)).toMatchObject({
      payload: {
        message: "Kall mot https://www.nav.no/api/plan feilet",
        requestUrl: "/api/[uuid]",
      },
    });
  });

  it("bruker normaliserte page ID-er og tracing", () => {
    expect(
      browserApmOptions.faro.pageTracking?.generatePageId?.({
        pathname: `/syk/oppfolgingsplan/${leaderId}/aktiv-plan`,
      } as Location),
    ).toBe("/syk/oppfolgingsplan/{narmesteLederId}/aktiv-plan");
    expect(browserApmOptions.tracing).toBe(true);
  });
});
