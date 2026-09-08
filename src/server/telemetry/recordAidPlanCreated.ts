import "server-only";
import { logger } from "@navikt/next-logger";
import { isLocalOrDemo } from "@/env-variables/envHelpers";
import { OPPFOLGINGSPLAN_TILTAKSPAKKE_1 } from "@/schema/flaggskipetSchemas";
import type { TiltakspakkeContext } from "@/schema/tiltakspakkeContext";

/** Called only after the plan API confirms saving. Never log the form or IDs. */
export function recordAidPlanCreated(
  tiltakspakke: TiltakspakkeContext,
  evalueringPaaminnelse: boolean,
): void {
  if (isLocalOrDemo) return;
  try {
    logger.info(
      {
        event_type: "aid_plan_opprettet",
        schema_version: "1",
        tiltakspakke: OPPFOLGINGSPLAN_TILTAKSPAKKE_1,
        gruppe: tiltakspakke.gruppe,
        skjemavariant: tiltakspakke.erITiltaksgruppe ? "tiltak" : "standard",
        evaluering_paaminnelse: evalueringPaaminnelse ? "ja" : "nei",
      },
      "Opprettelse av plan bekreftet av backend",
    );
  } catch {
    // A measurement failure must not turn a saved plan into a failed submission.
  }
}
