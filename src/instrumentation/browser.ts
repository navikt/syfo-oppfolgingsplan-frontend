import type { InitOptions } from "@nais/apm";
import { initNaisAPMClient } from "@nais/apm/react";
import { isLocalOrDemo } from "@/env-variables/envHelpers";
import { publicEnv } from "@/env-variables/publicEnv";

const BASE_PATH = publicEnv.NEXT_PUBLIC_BASE_PATH.replace(/\/$/, "");
const UNKNOWN_PAGE_ID = `${BASE_PATH}/{unknown}`;
const UUID =
  /\b[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\b/gi;
const ABSOLUTE_HTTP_URL = /https?:\/\/[^\s"'<>()[\]]+/gi;
const RELATIVE_URL_IN_TEXT =
  /(^|[^\w/])((?:\/(?!\/)|\.{1,2}\/)[^\s"'<>()[\]]*)/g;
const UUID_PATH_SEGMENT =
  "[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}";
const TRACE_URL_ATTRIBUTES = new Set([
  "http.target",
  "http.url",
  "url.full",
  "url.path",
]);

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

const withoutQueryAndFragment = (url: string): string => {
  const queryIndex = url.indexOf("?");
  const fragmentIndex = url.indexOf("#");
  const indexes = [queryIndex, fragmentIndex].filter((index) => index >= 0);
  return indexes.length > 0 ? url.slice(0, Math.min(...indexes)) : url;
};

const sanitizeAbsoluteUrl = (url: string): string => {
  const withoutDetails = withoutQueryAndFragment(url);

  try {
    const parsed = new URL(withoutDetails);
    return `${parsed.protocol}//${parsed.host}${parsed.pathname}`;
  } catch {
    return withoutDetails.replace(/^(https?:\/\/)[^/]*@/i, "$1");
  }
};

const normalizeTelemetryString = (value: string): string => {
  const withoutAbsoluteUrlDetails = value.replace(
    ABSOLUTE_HTTP_URL,
    sanitizeAbsoluteUrl,
  );
  const withoutUrlDetails = withoutAbsoluteUrlDetails.replace(
    RELATIVE_URL_IN_TEXT,
    (_match, prefix: string, url: string) =>
      `${prefix}${withoutQueryAndFragment(url)}`,
  );

  return withoutUrlDetails.replace(UUID, "[uuid]");
};

type ExceptionPayload = {
  value?: string;
  stacktrace?: {
    frames?: Array<{ filename?: string } & Record<string, unknown>>;
  } & Record<string, unknown>;
} & Record<string, unknown>;

const normalizeExceptionPayload = (payload: ExceptionPayload) => ({
  ...payload,
  ...(payload.value ? { value: normalizeTelemetryString(payload.value) } : {}),
  ...(payload.stacktrace?.frames
    ? {
        stacktrace: {
          ...payload.stacktrace,
          frames: payload.stacktrace.frames.map((frame) => ({
            ...frame,
            ...(frame.filename
              ? { filename: normalizeTelemetryString(frame.filename) }
              : {}),
          })),
        },
      }
    : {}),
});

type TracePayload = {
  resourceSpans?: Array<{
    scopeSpans?: Array<{
      spans?: Array<{
        attributes?: Array<{
          key?: string;
          value?: { stringValue?: string } & Record<string, unknown>;
        }>;
      }>;
    }>;
  }>;
} & Record<string, unknown>;

const normalizeTracePayload = (payload: TracePayload): TracePayload => {
  const normalized = structuredClone(payload);
  for (const resourceSpan of normalized.resourceSpans ?? []) {
    for (const scopeSpan of resourceSpan.scopeSpans ?? []) {
      for (const span of scopeSpan.spans ?? []) {
        for (const attribute of span.attributes ?? []) {
          const attributeValue = attribute.value;
          const stringValue = attributeValue?.stringValue;
          if (
            attribute.key &&
            TRACE_URL_ATTRIBUTES.has(attribute.key) &&
            stringValue
          ) {
            attributeValue.stringValue = normalizeTelemetryString(stringValue);
          }
        }
      }
    }
  }
  return normalized;
};

type EventPayload = {
  name?: string;
  attributes?: Record<string, string>;
} & Record<string, unknown>;

const normalizeEventPayload = (payload: EventPayload): EventPayload =>
  (payload.name === "faro.performance.navigation" ||
    payload.name === "faro.performance.resource") &&
  payload.attributes?.name
    ? {
        ...payload,
        attributes: {
          ...payload.attributes,
          name: normalizeTelemetryString(payload.attributes.name),
        },
      }
    : payload;

const normalizePayload = (type: string, payload: unknown): unknown => {
  if (!payload || typeof payload !== "object") return payload;
  if (type === "exception") {
    return normalizeExceptionPayload(payload as ExceptionPayload);
  }
  if (type === "trace") return normalizeTracePayload(payload as TracePayload);
  if (type === "event") return normalizeEventPayload(payload as EventPayload);
  return payload;
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
  const page = item.meta.page;

  return {
    ...item,
    payload: normalizePayload(item.type, item.payload),
    meta: {
      ...item.meta,
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
