import { describe, expect, it } from "vitest";
import {
  browserApmOptions,
  normalizeBrowserPath,
  scrubBrowserTelemetry,
  scrubTelemetryString,
} from "./browser";
import {
  BROWSER_APM_APP,
  BROWSER_APM_NAMESPACE,
  BROWSER_SESSION_SAMPLING_RATE,
  UNKNOWN_PAGE_ID,
} from "./browserConfig";

const leaderId = "11111111-1111-4111-8111-111111111111";
const planId = "22222222-2222-4222-8222-222222222222";

describe("browser-observability", () => {
  it.each([
    [
      `/syk/oppfolgingsplan/${leaderId}?fnr=01010112345#detaljer`,
      "/syk/oppfolgingsplan/{narmesteLederId}",
    ],
    [
      `/syk/oppfolgingsplan/${leaderId}/ny-plan`,
      "/syk/oppfolgingsplan/{narmesteLederId}/ny-plan",
    ],
    [
      `/syk/oppfolgingsplan/${leaderId}/aktiv-plan`,
      "/syk/oppfolgingsplan/{narmesteLederId}/aktiv-plan",
    ],
    [
      `/syk/oppfolgingsplan/${leaderId}/tidligere-planer/${planId}`,
      "/syk/oppfolgingsplan/{narmesteLederId}/tidligere-planer/{planId}",
    ],
    ["/syk/oppfolgingsplan/sykmeldt", "/syk/oppfolgingsplan/sykmeldt"],
    ["/sykmeldt", "/syk/oppfolgingsplan/sykmeldt"],
    [
      `/syk/oppfolgingsplan/sykmeldt/aktiv-plan/${planId}`,
      "/syk/oppfolgingsplan/sykmeldt/aktiv-plan/{planId}",
    ],
    [
      `/syk/oppfolgingsplan/sykmeldt/tidligere-planer/${planId}`,
      "/syk/oppfolgingsplan/sykmeldt/tidligere-planer/{planId}",
    ],
    [
      `/${leaderId}/tidligere-planer/${planId}?token=hemmelig#innhold`,
      "/syk/oppfolgingsplan/{narmesteLederId}/tidligere-planer/{planId}",
    ],
  ])("normaliserer page ID for %s", (path, expected) => {
    expect(normalizeBrowserPath(path)).toBe(expected);
  });

  it("sender ukjente ruter til én bounded fallback", () => {
    expect(normalizeBrowserPath(`/ukjent/${leaderId}/${planId}`)).toBe(
      UNKNOWN_PAGE_ID,
    );
    expect(normalizeBrowserPath("/api")).toBe(UNKNOWN_PAGE_ID);
    expect(normalizeBrowserPath("/favicon.ico")).toBe(UNKNOWN_PAGE_ID);
  });

  it("fjerner dynamiske verdier fra side-, API- og eksterne URL-er", () => {
    const value = [
      `side https://www.nav.no/syk/oppfolgingsplan/${leaderId}/tidligere-planer/${planId}?token=hemmelig#innhold`,
      `ag-pdf /syk/oppfolgingsplan/api/${leaderId}/pdf/${planId}?download=true`,
      `sm-pdf /syk/oppfolgingsplan/api/sykmeldt/pdf/${planId}?download=true`,
      `ekstern https://example.org/person/${leaderId}?fnr=01010112345`,
    ].join(" | ");

    const scrubbed = scrubTelemetryString(value);

    expect(scrubbed).toContain(
      "https://www.nav.no/syk/oppfolgingsplan/{narmesteLederId}/tidligere-planer/{planId}",
    );
    expect(scrubbed).toContain(
      "/syk/oppfolgingsplan/api/{narmesteLederId}/pdf/{planId}",
    );
    expect(scrubbed).toContain(
      "/syk/oppfolgingsplan/api/sykmeldt/pdf/{planId}",
    );
    expect(scrubbed).toContain("https://example.org/{unknown}");
    expect(scrubbed).not.toContain(leaderId);
    expect(scrubbed).not.toContain(planId);
    expect(scrubbed).not.toContain("hemmelig");
    expect(scrubbed).not.toContain("01010112345");
  });

  it.each([
    [
      "ftp://leder:hemmelig@host/sak/ola-nordmann?bedrift=975289753",
      "[ftp-url]",
    ],
    ["tel:+4712345678", "[tel-url]"],
    ["urn:person:ola-nordmann", "[urn-url]"],
    ["url=//host/sak/ola?bedrift=975289753", "url=//host/{unknown}"],
    ["url=/sak/ola?bedrift=975289753", "url=/{unknown}"],
    ["url=./sak/ola?bedrift=975289753", "url=/{unknown}"],
    ["url=../sak/ola?bedrift=975289753", "url=/{unknown}"],
    ["url=?bedrift=975289753", "url=/{unknown}"],
    ["url=#leder-ola-nordmann", "url=/{unknown}"],
    ["path:/sak/ola?bedrift=975289753", "path:/{unknown}"],
    ["query:?bedrift=975289753", "query:/{unknown}"],
    ["fragment:#leder-ola-nordmann", "fragment:/{unknown}"],
    ["http:ola-nordmann?bedrift=975289753", "[http-url]"],
    ["http:/ola-nordmann?bedrift=975289753", "[http-url]"],
    ["https:///ola-nordmann?bedrift=975289753", "[https-url]"],
    ["///ola-nordmann/sak?bedrift=975289753", "[url]"],
    ["////ola-nordmann/sak?bedrift=975289753", "[url]"],
    ["https://\\ola-nordmann/sak?bedrift=975289753", "[https-url]"],
  ])("feiler lukket for URL-referansen %s", (raw, expected) => {
    expect(scrubTelemetryString(raw)).toBe(expected);
  });

  it.each([
    [
      "/syk/oppfolgingsplan/api/logger?fnr=01010112345",
      "/syk/oppfolgingsplan/api/logger",
    ],
    ["/api/isAlive?token=hemmelig", "/syk/oppfolgingsplan/api/isAlive"],
    [
      "https://www.nav.no/syk/oppfolgingsplan/api/isReady?token=hemmelig",
      "https://www.nav.no/syk/oppfolgingsplan/api/isReady",
    ],
  ])("normaliserer den kjente ressursruten %s", (raw, expected) => {
    expect(scrubTelemetryString(raw)).toBe(expected);
  });

  it("beholder bare observerte Next.js-chunks for sourcemaps", () => {
    const chunkPath =
      "/syk/oppfolgingsplan/_next/static/chunks/app/[narmesteLederId]/tidligere-planer/[planId]/page-abc123.js";
    const stackUrl = `${globalThis.location.origin}${chunkPath}:123:45`;
    const script = document.createElement("script");
    script.src = chunkPath;
    document.head.append(script);
    const cdnStackUrl =
      "https://cdn.nav.no/team-esyfo/syfo-oppfolgingsplan-frontend/_next/static/chunks/app/sykmeldt/aktiv-plan/[planId]/page-def456.js:67:89";
    const cdnScript = document.createElement("script");
    cdnScript.src = cdnStackUrl.replace(":67:89", "");
    document.head.append(cdnScript);

    try {
      expect(scrubTelemetryString(`at Page (${stackUrl})`)).toBe(
        `at Page (${stackUrl})`,
      );
      expect(scrubTelemetryString(`at EmployeePage (${cdnStackUrl})`)).toBe(
        `at EmployeePage (${cdnStackUrl})`,
      );
    } finally {
      script.remove();
      cdnScript.remove();
    }

    for (const unsafeChunk of [
      "/syk/oppfolgingsplan/_next/static/chunks/ola-nordmann.js:12:34",
      "/syk/oppfolgingsplan/_next/static/chunks/x01010112345.js:12:34",
      "/team-esyfo/syfo-oppfolgingsplan-frontend/_next/static/chunks/hemmelig.js:12:34",
    ]) {
      expect(scrubTelemetryString(unsafeChunk)).toBe(
        "/syk/oppfolgingsplan/_next/{asset}",
      );
    }
  });

  it("scrubber rekursivt, fjerner user context og håndterer sirkler", () => {
    const circular: Record<string, unknown> = {};
    circular.self = circular;
    const raw = {
      type: "exception",
      payload: {
        value: `Feil for ${leaderId}, 01010112345 og leder@nav.no på /syk/oppfolgingsplan/${leaderId}`,
        nested: {
          [`plan-${planId}`]: `https://www.nav.no/syk/oppfolgingsplan/sykmeldt/aktiv-plan/${planId}?state=hemmelig`,
        },
        circular,
      },
      meta: {
        page: {
          url: `https://www.nav.no/syk/oppfolgingsplan/${leaderId}?fnr=01010112345`,
        },
        user: { id: "01010112345" },
      },
    } as Parameters<typeof scrubBrowserTelemetry>[0];

    const scrubbed = scrubBrowserTelemetry(raw);
    const serialized = JSON.stringify(scrubbed);

    expect(scrubbed?.meta?.user).toBeUndefined();
    expect(serialized).toContain("[uuid]");
    expect(serialized).toContain("[fnr]");
    expect(serialized).toContain("[email]");
    expect(serialized).toContain("[circular]");
    expect(serialized).toContain(
      "/syk/oppfolgingsplan/sykmeldt/aktiv-plan/{planId}",
    );
    expect(serialized).not.toContain(leaderId);
    expect(serialized).not.toContain(planId);
    expect(serialized).not.toContain("hemmelig");
  });

  it("har eksakt identitet, sampling og eksplisitte privacy-standardvalg", () => {
    expect(browserApmOptions.app).toBe(BROWSER_APM_APP);
    expect(browserApmOptions.namespace).toBe(BROWSER_APM_NAMESPACE);
    expect(browserApmOptions.version).toBeTruthy();
    expect(browserApmOptions.faro.sessionTracking?.samplingRate).toBe(
      BROWSER_SESSION_SAMPLING_RATE,
    );
    expect(
      browserApmOptions.faro.pageTracking?.generatePageId?.({
        pathname: `/syk/oppfolgingsplan/${leaderId}/aktiv-plan`,
      } as Location),
    ).toBe("/syk/oppfolgingsplan/{narmesteLederId}/aktiv-plan");
    expect(BROWSER_SESSION_SAMPLING_RATE).toBe(1);
    expect(browserApmOptions.dangerouslyDisablePiiScrubbing).toBe(false);
    expect(browserApmOptions.tracing).toBe(false);
    expect(browserApmOptions.sessionReplay.enabled).toBe(false);
    expect(browserApmOptions.screenshotOnError).toBe(false);
  });
});
