import { afterEach, describe, expect, test, vi } from "vitest";

vi.mock("@navikt/next-logger", () => ({
  logger: { info: vi.fn() },
}));

async function importRoute(isLocalOrDemo: boolean) {
  vi.resetModules();
  vi.doMock("@/env-variables/envHelpers", async () => ({
    ...(await vi.importActual<typeof import("@/env-variables/envHelpers")>(
      "@/env-variables/envHelpers",
    )),
    isLocalOrDemo,
  }));
  return await import("./route");
}

function feedbackRequest(body: string): Request {
  return new Request("http://localhost/api/lumi/feedback", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
  });
}

describe("POST /api/lumi/feedback", () => {
  afterEach(() => {
    vi.doUnmock("@/env-variables/envHelpers");
  });

  test("accepts feedback without forwarding it in local and demo", async () => {
    const { POST } = await importRoute(true);

    const response = await POST(feedbackRequest('{"answers":[]}'));

    expect(response.status).toBe(201);
    expect(await response.json()).toEqual({ id: "mock-feedback-id" });
  });

  test("rejects a body that is not JSON", async () => {
    const { POST } = await importRoute(true);

    const response = await POST(feedbackRequest("not json"));

    expect(response.status).toBe(400);
  });

  test("is not available outside local and demo", async () => {
    const { POST } = await importRoute(false);

    const response = await POST(feedbackRequest('{"answers":[]}'));

    expect(response.status).toBe(404);
  });
});
