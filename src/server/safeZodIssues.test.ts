import { describe, expect, test } from "vitest";
import { z } from "zod";
import { getSafeZodIssues } from "./safeZodIssues";

describe("getSafeZodIssues", () => {
  test("keeps schema-owned paths and codes", () => {
    const result = z.object({ id: z.string() }).safeParse({});
    expect(result.success).toBe(false);
    if (result.success) return;

    expect(
      getSafeZodIssues(result.error, z.object({ id: z.string() })),
    ).toEqual([{ code: "invalid_type", path: "id" }]);
  });

  test("masks dynamic keys even when they look like field names", () => {
    const privateKey = "OlaNordmann";
    const schema = z.record(z.string(), z.number());
    const result = schema.safeParse({ [privateKey]: "not-a-number" });
    expect(result.success).toBe(false);
    if (result.success) return;

    const issues = getSafeZodIssues(result.error, schema);
    expect(issues).toEqual([{ code: "invalid_type", path: "*" }]);
    expect(JSON.stringify(issues)).not.toContain(privateKey);
  });
});
