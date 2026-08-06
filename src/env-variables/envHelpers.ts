import z from "zod";

export const isLocalOrDemo =
  process.env.NEXT_PUBLIC_RUNTIME_ENVIRONMENT === "local" ||
  process.env.NEXT_PUBLIC_RUNTIME_ENVIRONMENT === "demo";

/**
 * Release-toggle for observasjonsmodus mot Flaggskipet.
 * Bevisst utenfor serverEnvSchema, slik at manglende env feiler lukket uten å
 * stoppe appen under oppstart.
 */
export function isTiltakspakkevurderingFeatureToggleEnabled(): boolean {
  return process.env.TILTAKSPAKKEVURDERING_FEATURE_TOGGLE === "true";
}

export function throwEnvSchemaParsingError(e: unknown): never {
  if (e instanceof z.ZodError) {
    throw new Error(
      `The following envs are missing: ${
        e.issues
          .filter(
            (it) =>
              it.code === "invalid_type" &&
              it.message.includes("received undefined"),
          )
          .map((it) => it.path.join("."))
          .join(", ") || "None are missing, but zod is not happy. Look at cause"
      }`,
      { cause: e },
    );
  } else {
    throw e;
  }
}
