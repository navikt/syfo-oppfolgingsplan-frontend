import { z } from "zod";
import { getBrowserObservability } from "./browser";

const eventSchema = z.object({
  hendelse: z.enum(["aapnet", "send", "lag_plan"]),
});

/** Only the offered exception flow emits these events, after opening. */
export function recordUnntak(event: z.infer<typeof eventSchema>): void {
  const parsed = eventSchema.safeParse(event);
  if (!parsed.success) return;
  try {
    getBrowserObservability()?.api.pushEvent(
      "unntaksvurdering",
      {
        ...parsed.data,
        flate: "oversikt_arbeidsgiver",
        schema_version: "2",
      },
      "oppfolgingsplan",
      { skipDedupe: true },
    );
  } catch {
    // Measurement must not interrupt form submission or navigation.
  }
}
