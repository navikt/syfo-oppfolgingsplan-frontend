import { z } from "zod";
import { OPPFOLGINGSPLAN_TILTAKSPAKKE_1 } from "@/schema/flaggskipetSchemas";
import { getBrowserObservability } from "./browser";

const eventSchema = z.object({
  hendelse: z.enum(["aapnet", "send", "lag_plan"]),
});

/** Only the offered AID exception flow emits these events, after opening. */
export function recordAidUnntak(event: z.infer<typeof eventSchema>): void {
  const parsed = eventSchema.safeParse(event);
  if (!parsed.success) return;
  try {
    getBrowserObservability()?.api.pushEvent(
      "aid_unntaksvurdering",
      {
        ...parsed.data,
        gruppe: "tiltak",
        tiltakspakke: OPPFOLGINGSPLAN_TILTAKSPAKKE_1,
        flate: "oversikt_arbeidsgiver",
        schema_version: "1",
      },
      "aid",
      { skipDedupe: true },
    );
  } catch {
    // Measurement must not interrupt form submission or navigation.
  }
}
