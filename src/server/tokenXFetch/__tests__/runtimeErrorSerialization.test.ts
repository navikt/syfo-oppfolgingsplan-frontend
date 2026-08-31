import {
  type Context,
  type ContextManager,
  context,
  ROOT_CONTEXT,
  TraceFlags,
  trace,
} from "@opentelemetry/api";
import {
  afterAll,
  beforeAll,
  beforeEach,
  describe,
  expect,
  test,
  vi,
} from "vitest";
import { z } from "zod";
import {
  getRuntimeErrorOperation,
  RuntimeErrorEvent,
  RuntimeErrorOperation,
  runtimeErrorOperationByEvent,
} from "@/common/runtimeErrorEvent";
import { frontendErrorTypeSchema } from "@/schema/errorSchemas";
import { FrontendErrorType } from "@/server/actions/FrontendErrorTypeEnum";
import {
  getAndLogErrorResultFromNonOkResponse,
  getAndLogFetchNetworkError,
} from "../errorHandling";
import { validateResponseBody } from "../validateResponseBody";

const serializedLogLines = vi.hoisted((): string[] => []);

vi.mock("@navikt/next-logger", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@navikt/next-logger")>();

  return {
    ...actual,
    logger: actual.backendLogger(
      {},
      {
        write(line: string) {
          serializedLogLines.push(line);
        },
      },
    ),
  };
});

let activeContext: Context = ROOT_CONTEXT;

const synchronousContextManager: ContextManager = {
  active: () => activeContext,
  bind: (_context, target) => target,
  disable() {
    activeContext = ROOT_CONTEXT;
    return this;
  },
  enable() {
    return this;
  },
  with(contextToActivate, fn, thisArg, ...args) {
    const previousContext = activeContext;
    activeContext = contextToActivate;
    try {
      return fn.call(thisArg, ...args);
    } finally {
      activeContext = previousContext;
    }
  },
};

async function withActiveTrace<T>(
  traceId: string,
  fn: () => T | Promise<T>,
): Promise<T> {
  const previousContext = activeContext;
  const span = trace.wrapSpanContext({
    traceId,
    spanId: "1234567890abcdef",
    traceFlags: TraceFlags.SAMPLED,
    isRemote: false,
  });
  activeContext = trace.setSpan(ROOT_CONTEXT, span);

  try {
    return await fn();
  } finally {
    activeContext = previousContext;
  }
}

function onlySerializedLog(): Record<string, unknown> {
  expect(serializedLogLines).toHaveLength(1);
  return JSON.parse(serializedLogLines[0]) as Record<string, unknown>;
}

describe("serialized runtime error contract", () => {
  beforeAll(() => {
    context.disable();
    context.setGlobalContextManager(synchronousContextManager.enable());
  });

  beforeEach(() => {
    activeContext = ROOT_CONTEXT;
    serializedLogLines.length = 0;
  });

  afterAll(() => {
    context.disable();
  });

  test("keeps event and operation catalogs closed, paired and low-cardinality", () => {
    const events = Object.values(RuntimeErrorEvent);
    const operations = Object.values(RuntimeErrorOperation);

    expect(new Set(events).size).toBe(events.length);
    expect(new Set(operations).size).toBe(operations.length);
    expect(Object.keys(runtimeErrorOperationByEvent)).toHaveLength(
      events.length,
    );

    for (const event of events) {
      const operation = getRuntimeErrorOperation(event);
      expect(event).toMatch(/^[a-z][a-z0-9_]*$/);
      expect(operation).toMatch(/^[a-z][a-z0-9_]*$/);
      expect(event).toBe(`${operation}_failed`);
      expect(event.length).toBeLessThanOrEqual(80);
      expect(operation.length).toBeLessThanOrEqual(80);
    }
  });

  test("produces the corrected unknown-response code while accepting legacy payloads", () => {
    expect(FrontendErrorType.FETCH_UNKNOWN_ERROR_RESPONSE).toBe(
      "FETCH_UNKNOWN_ERROR_RESPONSE",
    );
    expect(FrontendErrorType.FETCH_UNKOWN_ERROR_RESPONSE).toBe(
      FrontendErrorType.FETCH_UNKNOWN_ERROR_RESPONSE,
    );
    expect(frontendErrorTypeSchema.parse("FETCH_UNKOWN_ERROR_RESPONSE")).toBe(
      "FETCH_UNKOWN_ERROR_RESPONSE",
    );
  });

  test("emits one Pino JSON network error with operation and active trace", async () => {
    class Person12345678901Error extends Error {}

    const traceId = "1234567890abcdef1234567890abcdef";
    const eventType = RuntimeErrorEvent.TILTAKSPAKKEVURDERING_FETCH_FAILED;

    await withActiveTrace(traceId, () => {
      getAndLogFetchNetworkError({
        eventType,
        error: new Person12345678901Error(
          "fnr=12345678901 at https://example.test/person/42?token=secret-canary",
        ),
        method: "POST",
      });
    });

    const parsedLog = onlySerializedLog();
    const serializedLog = serializedLogLines[0];

    expect(parsedLog).toMatchObject({
      level: "error",
      event_type: eventType,
      operation: getRuntimeErrorOperation(eventType),
      error_code: "FETCH_NETWORK_ERROR",
      exception_type: "Error",
      method: "POST",
      trace_id: traceId,
      message: "TokenX fetch failed before receiving a response",
    });
    expect(Object.values(RuntimeErrorEvent)).toContain(parsedLog.event_type);
    expect(parsedLog).not.toHaveProperty("endpoint");
    expect(parsedLog).not.toHaveProperty("body");
    expect(parsedLog).not.toHaveProperty("err");
    expect(parsedLog).not.toHaveProperty("stack");
    expect(serializedLog).not.toContain("12345678901");
    expect(serializedLog).not.toContain("example.test");
    expect(serializedLog).not.toContain("secret-canary");
  });

  test("serializes an unexpected backend response without its body", async () => {
    const traceId = "2234567890abcdef1234567890abcdef";
    const eventType =
      RuntimeErrorEvent.OPPFOLGINGSPLAN_DEL_MED_NAV_VEILEDER_FAILED;
    const response = new Response(
      JSON.stringify({
        type: "INTERNAL_SERVER_ERROR",
        message: "Sensitive backend detail for 12345678901",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );

    const result = await withActiveTrace(traceId, () =>
      getAndLogErrorResultFromNonOkResponse({
        eventType,
        response,
        method: "POST",
      }),
    );

    expect(result).toEqual({
      type: "INTERNAL_SERVER_ERROR",
      message: "Sensitive backend detail for 12345678901",
    });
    const parsedLog = onlySerializedLog();
    expect(parsedLog).toMatchObject({
      level: "error",
      event_type: eventType,
      operation: getRuntimeErrorOperation(eventType),
      error_code: "INTERNAL_SERVER_ERROR",
      upstream_status: 500,
      method: "POST",
      trace_id: traceId,
      message: "TokenX fetch returned a non-OK response",
    });
    expect(parsedLog).not.toHaveProperty("status");
    expect(serializedLogLines[0]).not.toContain("12345678901");
    expect(serializedLogLines[0]).not.toContain("Sensitive backend detail");
  });

  test("serializes an invalid backend error body with the corrected code", async () => {
    const traceId = "2734567890abcdef1234567890abcdef";
    const eventType = RuntimeErrorEvent.OPPFOLGINGSPLAN_FERDIGSTILLING_FAILED;
    const response = new Response(
      "ukjent feilbody for 12345678901 ved https://example.test/person/42",
      { status: 502, headers: { "Content-Type": "text/plain" } },
    );

    const result = await withActiveTrace(traceId, () =>
      getAndLogErrorResultFromNonOkResponse({
        eventType,
        response,
        method: "POST",
      }),
    );

    expect(result).toEqual({ type: "FETCH_UNKNOWN_ERROR_RESPONSE" });
    expect(onlySerializedLog()).toMatchObject({
      level: "error",
      event_type: eventType,
      operation: getRuntimeErrorOperation(eventType),
      error_code: "FETCH_UNKNOWN_ERROR_RESPONSE",
      upstream_status: 502,
      method: "POST",
      trace_id: traceId,
      message:
        "TokenX fetch returned a non-OK response with an invalid error body",
    });
    expect(serializedLogLines[0]).not.toContain("12345678901");
    expect(serializedLogLines[0]).not.toContain("example.test");
  });

  test("serializes an expected domain outcome at info for the correct operation", async () => {
    const traceId = "3234567890abcdef1234567890abcdef";
    const eventType = RuntimeErrorEvent.OPPFOLGINGSPLAN_DEL_MED_LEGE_FAILED;
    const response = new Response(
      JSON.stringify({
        type: "LEGE_NOT_FOUND",
        message: "Legeopplysning for 12345678901",
      }),
      { status: 404, headers: { "Content-Type": "application/json" } },
    );

    await withActiveTrace(traceId, () =>
      getAndLogErrorResultFromNonOkResponse({
        eventType,
        response,
        method: "POST",
      }),
    );

    expect(onlySerializedLog()).toMatchObject({
      level: "info",
      event_type: eventType,
      operation: getRuntimeErrorOperation(eventType),
      error_code: "LEGE_NOT_FOUND",
      upstream_status: 404,
      method: "POST",
      trace_id: traceId,
      message: "TokenX fetch returned a non-OK response",
    });
    expect(serializedLogLines[0]).not.toContain("12345678901");
    expect(serializedLogLines[0]).not.toContain("Legeopplysning");
  });

  test("serializes invalid success-response validation with the same contract", async () => {
    const traceId = "4234567890abcdef1234567890abcdef";
    const eventType =
      RuntimeErrorEvent.OPPFOLGINGSPLAN_ARBEIDSGIVER_UTKAST_FETCH_FAILED;
    const response = new Response(
      JSON.stringify({ fnr: "12345678901", secret: "payload-canary" }),
      { status: 200, headers: { "Content-Type": "application/json" } },
    );

    const result = await withActiveTrace(traceId, () =>
      validateResponseBody({
        eventType,
        response,
        method: "GET",
        responseDataSchema: z.object({ id: z.string() }),
      }),
    );

    expect(result).toEqual({ success: false, validatedData: null });
    expect(onlySerializedLog()).toMatchObject({
      level: "error",
      event_type: eventType,
      operation: getRuntimeErrorOperation(eventType),
      error_code: "OK_RESPONSE_BUT_RESPONSE_BODY_INVALID",
      upstream_status: 200,
      method: "GET",
      trace_id: traceId,
      message: "TokenX fetch returned an invalid success response body",
    });
    expect(serializedLogLines[0]).not.toContain("12345678901");
    expect(serializedLogLines[0]).not.toContain("payload-canary");
  });
});
