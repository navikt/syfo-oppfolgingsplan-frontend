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
import { RuntimeErrorEvent } from "@/common/runtimeErrorEvent";
import { getAndLogFetchNetworkError } from "../errorHandling";

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

describe("serialized runtime error contract", () => {
  beforeAll(() => {
    context.disable();
    context.setGlobalContextManager(synchronousContextManager.enable());
  });

  beforeEach(() => {
    serializedLogLines.length = 0;
  });

  afterAll(() => {
    context.disable();
  });

  test("keeps the code-owned event catalog unique and low-cardinality", () => {
    const events = Object.values(RuntimeErrorEvent);

    expect(new Set(events).size).toBe(events.length);
    for (const event of events) {
      expect(event).toMatch(/^[a-z][a-z0-9_]*$/);
    }
  });

  test("emits one Pino JSON error with an allowlisted event and active trace", () => {
    class Person12345678901Error extends Error {}

    const traceId = "1234567890abcdef1234567890abcdef";
    const span = trace.wrapSpanContext({
      traceId,
      spanId: "1234567890abcdef",
      traceFlags: TraceFlags.SAMPLED,
      isRemote: false,
    });
    const contextWithSpan = trace.setSpan(ROOT_CONTEXT, span);

    context.with(contextWithSpan, () => {
      getAndLogFetchNetworkError({
        eventType: RuntimeErrorEvent.TILTAKSPAKKE_ASSESSMENT_FETCH_FAILED,
        error: new Person12345678901Error(
          "fnr=12345678901 at https://example.test/person/42?token=secret-canary",
        ),
        method: "POST",
      });
    });

    expect(serializedLogLines).toHaveLength(1);
    const serializedLog = serializedLogLines[0];
    const parsedLog = JSON.parse(serializedLog) as Record<string, unknown>;

    expect(parsedLog).toMatchObject({
      level: "error",
      event_type: RuntimeErrorEvent.TILTAKSPAKKE_ASSESSMENT_FETCH_FAILED,
      error_code: "FETCH_NETWORK_ERROR",
      exception_type: "Error",
      method: "POST",
      trace_id: traceId,
      message: "TokenX fetch failed before receiving a response",
    });
    expect(Object.values(RuntimeErrorEvent)).toContain(parsedLog.event_type);
    expect(parsedLog.event_type).toMatch(/^[a-z][a-z0-9_]*$/);
    expect(parsedLog).not.toHaveProperty("endpoint");
    expect(parsedLog).not.toHaveProperty("body");
    expect(parsedLog).not.toHaveProperty("err");
    expect(parsedLog).not.toHaveProperty("stack");
    expect(serializedLog).not.toContain("12345678901");
    expect(serializedLog).not.toContain("example.test");
    expect(serializedLog).not.toContain("secret-canary");
  });
});
