import { type InitOptions, scrubString } from "@nais/apm";
import { initNaisAPMClient } from "@nais/apm/react";
import { isLocalOrDemo } from "@/env-variables/envHelpers";
import { publicEnv } from "@/env-variables/publicEnv";

const BASE_PATH = publicEnv.NEXT_PUBLIC_BASE_PATH.replace(/\/$/, "");
const UNKNOWN_PAGE_ID = `${BASE_PATH}/{unknown}`;
const UUID =
  /\b[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\b/gi;
const UUID_PATH_SEGMENT =
  "[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}";
const MAX_SCRUB_DEPTH = 32;
const UNSAFE_PAYLOAD = Symbol("unsafe-payload");

const pageRoute = (pattern: string, pageId: string) =>
  [new RegExp(pattern, "i"), `${BASE_PATH}${pageId}`] as const;

const pageRoutes: ReadonlyArray<readonly [RegExp, string]> = [
  pageRoute("^/sykmeldt/?$", "/sykmeldt"),
  pageRoute(
    `^/sykmeldt/aktiv-plan/${UUID_PATH_SEGMENT}/?$`,
    "/sykmeldt/aktiv-plan/{planId}",
  ),
  pageRoute(
    `^/sykmeldt/tidligere-planer/${UUID_PATH_SEGMENT}/?$`,
    "/sykmeldt/tidligere-planer/{planId}",
  ),
  pageRoute(`^/${UUID_PATH_SEGMENT}/ny-plan/?$`, "/{narmesteLederId}/ny-plan"),
  pageRoute(
    `^/${UUID_PATH_SEGMENT}/aktiv-plan/?$`,
    "/{narmesteLederId}/aktiv-plan",
  ),
  pageRoute(
    `^/${UUID_PATH_SEGMENT}/tidligere-planer/${UUID_PATH_SEGMENT}/?$`,
    "/{narmesteLederId}/tidligere-planer/{planId}",
  ),
  pageRoute(`^/${UUID_PATH_SEGMENT}/?$`, "/{narmesteLederId}"),
];

const withoutBasePath = (pathname: string): string => {
  if (pathname === BASE_PATH) return "/";
  return pathname.startsWith(`${BASE_PATH}/`)
    ? pathname.slice(BASE_PATH.length)
    : pathname;
};

export function normalizeBrowserPath(value: string): string {
  const pathname = value.split(/[?#]/, 1)[0] || "/";
  const route = withoutBasePath(pathname);
  return (
    pageRoutes.find(([pattern]) => pattern.test(route))?.[1] ?? UNKNOWN_PAGE_ID
  );
}

const scrubUuidValues = (
  value: unknown,
  depth = 0,
  seen = new WeakSet<object>(),
): unknown | typeof UNSAFE_PAYLOAD => {
  if (typeof value === "string") {
    return scrubString(value).replace(UUID, "[uuid]");
  }
  if (value === null || typeof value !== "object") return value;
  if (depth >= MAX_SCRUB_DEPTH || seen.has(value)) return UNSAFE_PAYLOAD;
  seen.add(value);

  if (Array.isArray(value)) {
    const sanitized = [];
    for (const entry of value) {
      const sanitizedEntry = scrubUuidValues(entry, depth + 1, seen);
      if (sanitizedEntry === UNSAFE_PAYLOAD) return UNSAFE_PAYLOAD;
      sanitized.push(sanitizedEntry);
    }
    seen.delete(value);
    return sanitized;
  }

  const sanitized: Record<string, unknown> = {};
  for (const [key, entry] of Object.entries(value)) {
    const sanitizedEntry = scrubUuidValues(entry, depth + 1, seen);
    if (sanitizedEntry === UNSAFE_PAYLOAD) return UNSAFE_PAYLOAD;
    sanitized[key] = sanitizedEntry;
  }
  seen.delete(value);
  return sanitized;
};

const sanitizePage = (url: string): { id: string; url: string } => {
  try {
    const parsed = new URL(url);
    const id = normalizeBrowserPath(parsed.pathname);
    return { id, url: `${parsed.origin}${id}` };
  } catch {
    return { id: UNKNOWN_PAGE_ID, url: UNKNOWN_PAGE_ID };
  }
};

type BeforeSend = NonNullable<InitOptions["beforeSend"]>;

export const sanitizeBrowserTelemetry: BeforeSend = (item) => {
  const { user: _user, ...meta } = item.meta;
  const page = meta.page;
  const payload = scrubUuidValues(item.payload);
  if (payload === UNSAFE_PAYLOAD) return null;

  return {
    ...item,
    payload,
    meta: {
      ...meta,
      ...(page?.url ? { page: { ...page, ...sanitizePage(page.url) } } : {}),
    },
  } as typeof item;
};

export const browserApmOptions = {
  beforeSend: sanitizeBrowserTelemetry,
  faro: {
    pageTracking: {
      generatePageId: ({ pathname }) => normalizeBrowserPath(pathname),
    },
  },
  tracing: true,
} satisfies InitOptions;

export function initBrowserObservability() {
  if (isLocalOrDemo) return undefined;
  return initNaisAPMClient(browserApmOptions);
}
