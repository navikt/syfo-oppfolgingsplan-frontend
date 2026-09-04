import { type ZodError, type ZodType, z } from "zod";

const collectSchemaFieldNames = (schema: ZodType): Set<string> => {
  const fieldNames = new Set<string>();

  try {
    const jsonSchema = z.toJSONSchema(schema, { unrepresentable: "any" });
    const pending: unknown[] = [jsonSchema];
    const visited = new Set<object>();

    while (pending.length > 0) {
      const value = pending.pop();
      if (typeof value !== "object" || value === null || visited.has(value)) {
        continue;
      }
      visited.add(value);

      if (
        "properties" in value &&
        typeof value.properties === "object" &&
        value.properties !== null
      ) {
        Object.keys(value.properties).forEach((name) => {
          fieldNames.add(name);
        });
      }

      pending.push(...Object.values(value));
    }
  } catch {
    // If a schema cannot be represented, omit its paths rather than guessing.
  }

  return fieldNames;
};

const safeValidationPath = (
  path: PropertyKey[],
  schemaFieldNames: ReadonlySet<string>,
): string =>
  path
    .map((segment) => {
      if (typeof segment === "number") return "[]";
      if (typeof segment === "string" && schemaFieldNames.has(segment)) {
        return segment;
      }
      return "*";
    })
    .join(".") || "$";

export const getSafeZodIssues = (error: ZodError, schema: ZodType) => {
  const schemaFieldNames = collectSchemaFieldNames(schema);
  return error.issues.slice(0, 20).map((issue) => ({
    code: issue.code,
    path: safeValidationPath(issue.path, schemaFieldNames),
  }));
};
