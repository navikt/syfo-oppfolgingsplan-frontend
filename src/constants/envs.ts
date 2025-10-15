import { z, ZodError } from "zod";

export type PublicEnv = z.infer<typeof publicEnvSchema>;
export const publicEnvSchema = z.object({
  NEXT_PUBLIC_RUNTIME_ENVIRONMENT: z.union([
    z.literal("local"),
    z.literal("test"),
    z.literal("demo"),
    z.literal("dev"),
    z.literal("prod"),
  ]),
  NEXT_PUBLIC_ASSET_PREFIX: z.string().optional(),
  NEXT_PUBLIC_TELEMETRY_URL: z.string().optional(),
  NEXT_PUBLIC_BASE_PATH: z.string(),
  NEXT_PUBLIC_DINE_SYKMELDTE_URL: z.string(),
  NEXT_PUBLIC_MIN_SIDE_ROOT: z.string(),
  NEXT_PUBLIC_MIN_SIDE_ARBEIDSGIVER_URL: z.string(),
});

export type ServerEnv = z.infer<typeof serverEnvSchema>;
export const serverEnvSchema = z.object({
  // Provided by nais-*.yaml
  DINESYKMELDTE_BACKEND_HOST: z.string(),
  DINESYKMELDTE_BACKEND_CLIENT_ID: z.string(),
  SYFO_OPPFOLGINGSPLAN_BACKEND_HOST: z.string(),
  SYFO_OPPFOLGINGSPLAN_BACKEND_CLIENT_ID: z.string(),
  FLEXJAR_HOST: z.string(),
  FLEXJAR_BACKEND_CLIENT_ID: z.string(),
  // Provided by nais
  TOKEN_X_WELL_KNOWN_URL: z.string(),
  TOKEN_X_CLIENT_ID: z.string(),
  TOKEN_X_PRIVATE_JWK: z.string(),
  IDPORTEN_WELL_KNOWN_URL: z.string(),
  IDPORTEN_CLIENT_ID: z.string(),
  NAIS_CLUSTER_NAME: z.string(),
});

/**
 * These envs are available in the browser. They are replaced during the bundling step by NextJS.
 *
 * They MUST be provided during the build step.
 */
export const publicEnv = publicEnvSchema.parse({
  NEXT_PUBLIC_RUNTIME_ENVIRONMENT: process.env.NEXT_PUBLIC_RUNTIME_ENVIRONMENT,
  NEXT_PUBLIC_ASSET_PREFIX: process.env.NEXT_PUBLIC_ASSET_PREFIX,
  NEXT_PUBLIC_TELEMETRY_URL: process.env.NEXT_PUBLIC_TELEMETRY_URL,
  NEXT_PUBLIC_BASE_PATH: process.env.NEXT_PUBLIC_BASE_PATH,
  NEXT_PUBLIC_DINE_SYKMELDTE_URL: process.env.NEXT_PUBLIC_DINE_SYKMELDTE_URL,
  NEXT_PUBLIC_MIN_SIDE_ROOT: process.env.NEXT_PUBLIC_MIN_SIDE_ROOT,
  NEXT_PUBLIC_MIN_SIDE_ARBEIDSGIVER_URL:
    process.env.NEXT_PUBLIC_MIN_SIDE_ARBEIDSGIVER_URL,
} satisfies Record<keyof PublicEnv, string | undefined>);

const getRawServerConfig = (): Partial<unknown> =>
  ({
    // Provided by nais-*.yml
    DINESYKMELDTE_BACKEND_HOST: process.env.DINESYKMELDTE_BACKEND_HOST,
    DINESYKMELDTE_BACKEND_CLIENT_ID:
      process.env.DINESYKMELDTE_BACKEND_CLIENT_ID,
    SYFO_OPPFOLGINGSPLAN_BACKEND_HOST:
      process.env.SYFO_OPPFOLGINGSPLAN_BACKEND_HOST,
    SYFO_OPPFOLGINGSPLAN_BACKEND_CLIENT_ID:
      process.env.SYFO_OPPFOLGINGSPLAN_BACKEND_CLIENT_ID,
    FLEXJAR_HOST: process.env.FLEXJAR_HOST,
    FLEXJAR_BACKEND_CLIENT_ID: process.env.FLEXJAR_BACKEND_CLIENT_ID,

    // Provided by nais
    TOKEN_X_WELL_KNOWN_URL: process.env.TOKEN_X_WELL_KNOWN_URL,
    TOKEN_X_CLIENT_ID: process.env.TOKEN_X_CLIENT_ID,
    TOKEN_X_PRIVATE_JWK: process.env.TOKEN_X_PRIVATE_JWK,
    IDPORTEN_WELL_KNOWN_URL: process.env.IDPORTEN_WELL_KNOWN_URL,
    IDPORTEN_CLIENT_ID: process.env.IDPORTEN_CLIENT_ID,
    NAIS_CLUSTER_NAME: process.env.NAIS_CLUSTER_NAME,
  }) satisfies Record<keyof ServerEnv, string | undefined>;

export function getServerEnv(): ServerEnv & PublicEnv {
  try {
    return {
      ...serverEnvSchema.parse(getRawServerConfig()),
      ...publicEnvSchema.parse(publicEnv),
    };
  } catch (e) {
    if (e instanceof ZodError) {
      throw new Error();
      // TODO: uncomment and fix type errors after upgrading to zod v4
      // `The following envs are missing: ${
      //   e.errors
      //     .filter((it) => it.message === "Required")
      //     .map((it) => it.path.join("."))
      //     .join(", ") ||
      //   "None are missing, but zod is not happy. Look at cause"
      // }`,
      // { cause: e },
    } else {
      throw e;
    }
  }
}

export const isLocalOrDemo =
  process.env.NEXT_PUBLIC_RUNTIME_ENVIRONMENT === "local" ||
  process.env.NEXT_PUBLIC_RUNTIME_ENVIRONMENT === "demo";
