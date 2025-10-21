import { z } from "zod";
import { throwEnvSchemaParsingError } from "./envHelpers";

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

/**
 * These envs are available in the browser. They are replaced during the bundling step by NextJS.
 */
export const rawPublicEnv = {
  NEXT_PUBLIC_RUNTIME_ENVIRONMENT: process.env.NEXT_PUBLIC_RUNTIME_ENVIRONMENT,
  NEXT_PUBLIC_ASSET_PREFIX: process.env.NEXT_PUBLIC_ASSET_PREFIX,
  NEXT_PUBLIC_TELEMETRY_URL: process.env.NEXT_PUBLIC_TELEMETRY_URL,
  NEXT_PUBLIC_BASE_PATH: process.env.NEXT_PUBLIC_BASE_PATH,
  NEXT_PUBLIC_DINE_SYKMELDTE_URL: process.env.NEXT_PUBLIC_DINE_SYKMELDTE_URL,
  NEXT_PUBLIC_MIN_SIDE_ROOT: process.env.NEXT_PUBLIC_MIN_SIDE_ROOT,
  NEXT_PUBLIC_MIN_SIDE_ARBEIDSGIVER_URL:
    process.env.NEXT_PUBLIC_MIN_SIDE_ARBEIDSGIVER_URL,
} satisfies Record<keyof PublicEnv, string | undefined>;

// Evaluate once at module load time with an IIFE.
export const publicEnv: Readonly<PublicEnv> = (() => {
  try {
    return Object.freeze(publicEnvSchema.parse(rawPublicEnv));
  } catch (err) {
    throwEnvSchemaParsingError(err);
  }
})();
