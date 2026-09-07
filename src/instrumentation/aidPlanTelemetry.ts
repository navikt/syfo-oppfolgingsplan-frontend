import { z } from "zod";
import { OPPFOLGINGSPLAN_TILTAKSPAKKE_1 } from "@/schema/flaggskipetSchemas";
import {
  type TiltakspakkeContext,
  tildelingsgruppeSchema,
} from "@/schema/tiltakspakkeContext";
import { getBrowserObservability } from "./browser";

const contextSchema = z.object({
  gruppe: tildelingsgruppeSchema,
  variant: z.enum(["aid", "standard"]),
});
const eventSchema = z.union([
  contextSchema.extend({
    hendelse: z.enum(["beslutning", "vist"]),
    utfall: z.literal("tilgjengelig"),
  }),
  contextSchema.extend({
    hendelse: z.literal("opprett"),
    utfall: z.enum(["forsok", "bekreftet", "feilet"]),
  }),
]);
type AidPlanEvent = z.infer<typeof eventSchema>;

export function getAidPlanAttributes({
  gruppe,
  erITiltaksgruppe,
}: TiltakspakkeContext): z.infer<typeof contextSchema> {
  return { gruppe, variant: erITiltaksgruppe ? "aid" : "standard" };
}

/** Closed categories only. Existing APM metadata/scrubbing stays in place. */
export function recordAidPlan(event: AidPlanEvent): void {
  const parsed = eventSchema.safeParse(event);
  if (!parsed.success) return;
  try {
    // Reuse the initialized instance. Separate visits/actions can have identical
    // categories, so opt out of event dedupe without adding a tracking ID.
    getBrowserObservability()?.api.pushEvent(
      "aid_oppfolgingsplan",
      {
        ...parsed.data,
        tiltakspakke: OPPFOLGINGSPLAN_TILTAKSPAKKE_1,
        flate: "ny_plan",
        schema_version: "1",
      },
      "aid",
      { skipDedupe: true },
    );
  } catch {
    // Measurement must not interrupt saving or navigation.
  }
}
