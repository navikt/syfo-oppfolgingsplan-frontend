import { type InitOptions, scrubString } from "@nais/apm";
import { initNaisAPMClient } from "@nais/apm/react";
import { isLocalOrDemo } from "@/env-variables/envHelpers";
import { publicEnv } from "@/env-variables/publicEnv";
import {
  BROWSER_SESSION_SAMPLING_RATE,
  browserApmIdentity,
  UNKNOWN_PAGE_ID,
} from "./browserConfig";

const BASE_PATH = publicEnv.NEXT_PUBLIC_BASE_PATH.replace(/\/$/, "");
const UNKNOWN_RESOURCE_PATH = "/{unknown}";
const UUID =
  /\b[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\b/gi;
const UUID_PATH_SEGMENT =
  "[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}";
const SCHEME_URL =
  /\b(?:(?:https?|wss?):[^\s"'<>]+|[a-z][a-z0-9+.-]*:\/\/[^\s"'<>]+|(?:about|blob|data|file|javascript|mailto|tel|urn|sms|geo|sips?):[^\s"'<>]+)/gi;
const VALID_HTTP_OR_WS_URL = /^(?:https?|wss?):\/\/[^/\\?#\s]+(?:[/?#]|$)/i;
const VALID_PROTOCOL_RELATIVE_URL = /^\/\/[^/\\?#\s]+(?:[/?#]|$)/;
const PROTOCOL_RELATIVE_URL = /(^|[^a-z0-9/:])(\/\/[^\s"'<>]+)/gi;
const RELATIVE_URL =
  /(^|[^a-z0-9/])((?:\/(?!\/)|(?:\.\.\/|\.\/)|[?#])[^\s"'<>]*)/gi;
const TRAILING_URL_PUNCTUATION = /[\]),.;!?}]+$/;
const NEXT_CHUNK_PATH =
  /^\/(?:(?:syk\/oppfolgingsplan|team-esyfo\/syfo-oppfolgingsplan-frontend)\/)?_next\/static\/chunks\/(?:(?:[a-z0-9._[\]-]|%5b|%5d)+\/)*(?:[a-z0-9._[\]-]|%5b|%5d)+\.js$/i;
const NEXT_CHUNK_WITH_POSITION = /^(.*\.js)(:\d+:\d+)?$/i;
const CONFIGURED_ASSET_PREFIX = publicEnv.NEXT_PUBLIC_ASSET_PREFIX;
const MAX_SCRUB_DEPTH = 12;

const pageRoutes: Array<[RegExp, string]> = [
  [/^\/sykmeldt\/?$/, `${BASE_PATH}/sykmeldt`],
  [
    new RegExp(`^/sykmeldt/aktiv-plan/${UUID_PATH_SEGMENT}/?$`, "i"),
    `${BASE_PATH}/sykmeldt/aktiv-plan/{planId}`,
  ],
  [
    new RegExp(`^/sykmeldt/tidligere-planer/${UUID_PATH_SEGMENT}/?$`, "i"),
    `${BASE_PATH}/sykmeldt/tidligere-planer/{planId}`,
  ],
  [
    new RegExp(`^/${UUID_PATH_SEGMENT}/ny-plan/?$`, "i"),
    `${BASE_PATH}/{narmesteLederId}/ny-plan`,
  ],
  [
    new RegExp(`^/${UUID_PATH_SEGMENT}/aktiv-plan/?$`, "i"),
    `${BASE_PATH}/{narmesteLederId}/aktiv-plan`,
  ],
  [
    new RegExp(
      `^/${UUID_PATH_SEGMENT}/tidligere-planer/${UUID_PATH_SEGMENT}/?$`,
      "i",
    ),
    `${BASE_PATH}/{narmesteLederId}/tidligere-planer/{planId}`,
  ],
  [
    new RegExp(`^/${UUID_PATH_SEGMENT}/?$`, "i"),
    `${BASE_PATH}/{narmesteLederId}`,
  ],
];

const resourceRoutes: Array<[RegExp, string]> = [
  [
    new RegExp(`^/api/sykmeldt/pdf/${UUID_PATH_SEGMENT}/?$`, "i"),
    `${BASE_PATH}/api/sykmeldt/pdf/{planId}`,
  ],
  [
    new RegExp(`^/api/${UUID_PATH_SEGMENT}/pdf/${UUID_PATH_SEGMENT}/?$`, "i"),
    `${BASE_PATH}/api/{narmesteLederId}/pdf/{planId}`,
  ],
  [/^\/api\/logger\/?$/, `${BASE_PATH}/api/logger`],
  [/^\/api\/isAlive\/?$/, `${BASE_PATH}/api/isAlive`],
  [/^\/api\/isReady\/?$/, `${BASE_PATH}/api/isReady`],
];

const assetRoutes: Array<[RegExp, string]> = [
  [/^\/_next(?:\/.*)?$/, `${BASE_PATH}/_next/{asset}`],
  [/^\/syk\/oppfolgingsplan\/_next(?:\/.*)?$/, `${BASE_PATH}/_next/{asset}`],
  [
    /^\/team-esyfo\/syfo-oppfolgingsplan-frontend\/_next(?:\/.*)?$/,
    `${BASE_PATH}/_next/{asset}`,
  ],
];

const pathWithoutBase = (pathname: string): string => {
  if (pathname === BASE_PATH) return "/";
  return pathname.startsWith(`${BASE_PATH}/`)
    ? pathname.slice(BASE_PATH.length)
    : pathname;
};

const matchRoute = (
  pathname: string,
  routes: Array<[RegExp, string]>,
): string | undefined =>
  routes.find(([pattern]) => pattern.test(pathWithoutBase(pathname)))?.[1];

export function normalizeBrowserPath(value: string): string {
  const pathname = value.split(/[?#]/, 1)[0] || "/";
  return matchRoute(pathname, pageRoutes) ?? UNKNOWN_PAGE_ID;
}

const normalizeTelemetryPath = (
  pathname: string,
  allowBareAppRoutes: boolean,
): string => {
  const hasBasePath =
    pathname === BASE_PATH || pathname.startsWith(`${BASE_PATH}/`);
  const relativePath = pathWithoutBase(pathname);

  if (hasBasePath || allowBareAppRoutes) {
    const pageRoute = pageRoutes.find(([pattern]) =>
      pattern.test(relativePath),
    );
    if (pageRoute) return pageRoute[1];

    const resourceRoute = resourceRoutes.find(([pattern]) =>
      pattern.test(relativePath),
    );
    if (resourceRoute) return resourceRoute[1];
  }

  return (
    assetRoutes.find(([pattern]) => pattern.test(pathname))?.[1] ??
    UNKNOWN_RESOURCE_PATH
  );
};

const isNextChunkPath = (pathname: string): boolean =>
  NEXT_CHUNK_PATH.test(pathname);

const isConfiguredAssetUrl = (url: URL): boolean => {
  if (!CONFIGURED_ASSET_PREFIX) return false;
  try {
    const prefix = new URL(CONFIGURED_ASSET_PREFIX);
    const prefixPath = prefix.pathname.replace(/\/$/, "");
    return (
      url.origin === prefix.origin &&
      url.pathname.startsWith(`${prefixPath}/_next/static/chunks/`) &&
      isNextChunkPath(url.pathname)
    );
  } catch {
    return false;
  }
};

type CanonicalNextChunk = { resourceUrl: string; position: string };

const canonicalTrustedNextChunkUrl = (
  value: string,
): CanonicalNextChunk | null => {
  const match = value.match(NEXT_CHUNK_WITH_POSITION);
  const resourceUrl = match?.[1];
  if (!resourceUrl || typeof globalThis.location === "undefined") return null;

  try {
    const url = new URL(resourceUrl, globalThis.location.href);
    if (url.username || url.password || url.search || url.hash) return null;
    if (!isNextChunkPath(url.pathname)) return null;

    const isSameOrigin = url.origin === globalThis.location.origin;
    if (!isSameOrigin && !isConfiguredAssetUrl(url)) return null;
    return { resourceUrl: url.href, position: match[2] ?? "" };
  } catch {
    return null;
  }
};

const observedBrowserScriptUrls = (): string[] => {
  const scriptUrls =
    typeof globalThis.document === "undefined"
      ? []
      : Array.from(globalThis.document.scripts, (script) => script.src).filter(
          Boolean,
        );

  if (typeof globalThis.performance?.getEntriesByType !== "function") {
    return scriptUrls;
  }

  const resourceUrls = globalThis.performance
    .getEntriesByType("resource")
    .filter(
      (entry): entry is PerformanceResourceTiming =>
        "initiatorType" in entry && entry.initiatorType === "script",
    )
    .map((entry) => entry.name);
  return [...scriptUrls, ...resourceUrls];
};

const observedNextChunkUrl = (value: string): string | null => {
  const candidate = canonicalTrustedNextChunkUrl(value);
  if (!candidate) return null;

  const isObserved = observedBrowserScriptUrls().some(
    (observed) =>
      canonicalTrustedNextChunkUrl(observed)?.resourceUrl ===
      candidate.resourceUrl,
  );
  return isObserved ? `${candidate.resourceUrl}${candidate.position}` : null;
};

const sanitizeUrl = (value: string): string => {
  const observedChunk = observedNextChunkUrl(value);
  if (observedChunk) return observedChunk;

  try {
    const protocolRelative = value.startsWith("//");
    const url = new URL(protocolRelative ? `https:${value}` : value);
    const origin = protocolRelative ? `//${url.host}` : url.origin;
    return `${origin}${normalizeTelemetryPath(url.pathname, false)}`;
  } catch {
    return "[url]";
  }
};

const sanitizeProtocolRelativeUrl = (value: string): string =>
  VALID_PROTOCOL_RELATIVE_URL.test(value) ? sanitizeUrl(value) : "[url]";

const sanitizeRelativeUrl = (value: string): string => {
  if (!value.startsWith("/")) return UNKNOWN_RESOURCE_PATH;
  const observedChunk = observedNextChunkUrl(value);
  if (observedChunk) return observedChunk;
  const pathname = value.split(/[?#]/, 1)[0] || "/";
  return normalizeTelemetryPath(pathname, true);
};

const sanitizeUrlToken = (
  value: string,
  sanitizer: (url: string) => string,
): string => {
  const suffix = value.match(TRAILING_URL_PUNCTUATION)?.[0] ?? "";
  const url = suffix ? value.slice(0, -suffix.length) : value;
  return `${sanitizer(url)}${suffix}`;
};

export function scrubTelemetryString(value: string): string {
  let tokenMarker = "\u{e000}";
  while (value.includes(tokenMarker)) tokenMarker += "\u{e001}";
  const protectedValues: string[] = [];
  const protect = (sanitized: string): string => {
    const token = `${tokenMarker}${protectedValues.length}${tokenMarker}`;
    protectedValues.push(sanitized);
    return token;
  };

  const withoutSchemeUrlDetails = value.replace(SCHEME_URL, (url) => {
    const normalizedScheme = url.slice(0, url.indexOf(":")).toLowerCase();
    return protect(
      sanitizeUrlToken(url, (urlWithoutPunctuation) => {
        if (
          /^(?:https?|wss?)$/.test(normalizedScheme) &&
          VALID_HTTP_OR_WS_URL.test(urlWithoutPunctuation)
        ) {
          return sanitizeUrl(urlWithoutPunctuation);
        }
        return `[${normalizedScheme}-url]`;
      }),
    );
  });
  const withoutProtocolRelativeUrls = withoutSchemeUrlDetails.replace(
    PROTOCOL_RELATIVE_URL,
    (_, prefix: string, url: string) =>
      `${prefix}${protect(sanitizeUrlToken(url, sanitizeProtocolRelativeUrl))}`,
  );
  let withoutRelativeUrlDetails = withoutProtocolRelativeUrls.replace(
    RELATIVE_URL,
    (_, prefix: string, url: string) =>
      `${prefix}${sanitizeUrlToken(url, sanitizeRelativeUrl)}`,
  );

  protectedValues.forEach((sanitized, index) => {
    withoutRelativeUrlDetails = withoutRelativeUrlDetails.replaceAll(
      `${tokenMarker}${index}${tokenMarker}`,
      sanitized,
    );
  });
  return scrubString(withoutRelativeUrlDetails.replace(UUID, "[uuid]"));
}

const scrubTelemetryValue = (
  value: unknown,
  depth = 0,
  seen = new WeakSet<object>(),
): unknown => {
  if (typeof value === "string") return scrubTelemetryString(value);
  if (value === null || typeof value !== "object") return value;
  if (depth >= MAX_SCRUB_DEPTH) return "[truncated]";
  if (seen.has(value)) return "[circular]";
  seen.add(value);

  if (Array.isArray(value)) {
    return value.map((item) => scrubTelemetryValue(item, depth + 1, seen));
  }

  const copy: Record<string, unknown> = {};
  for (const [key, item] of Object.entries(value)) {
    copy[scrubTelemetryString(key)] = scrubTelemetryValue(
      item,
      depth + 1,
      seen,
    );
  }
  return copy;
};

type BeforeSend = NonNullable<InitOptions["beforeSend"]>;

export const scrubBrowserTelemetry: BeforeSend = (item) => {
  const scrubbed = scrubTelemetryValue(item) as typeof item;
  if (scrubbed.meta?.user) {
    const meta = { ...scrubbed.meta };
    delete meta.user;
    return { ...scrubbed, meta };
  }
  return scrubbed;
};

export const browserApmOptions = {
  ...browserApmIdentity,
  beforeSend: scrubBrowserTelemetry,
  dangerouslyDisablePiiScrubbing: false,
  faro: {
    pageTracking: {
      generatePageId: (location) => normalizeBrowserPath(location.pathname),
    },
    sessionTracking: {
      samplingRate: BROWSER_SESSION_SAMPLING_RATE,
    },
  },
  tracing: false,
  sessionReplay: { enabled: false },
  screenshotOnError: false,
} satisfies InitOptions;

export function initBrowserObservability() {
  if (isLocalOrDemo) return undefined;
  return initNaisAPMClient(browserApmOptions);
}
