import "server-only";
import { cache } from "react";
import {
  isDialogmoteTiltakspakkeFeatureToggleEnabled,
  isTiltakspakkevurderingFeatureToggleEnabled,
} from "@/env-variables/envHelpers";
import {
  DIALOGMOTE_TILTAKSPAKKE_2,
  OPPFOLGINGSPLAN_TILTAKSPAKKE_1,
} from "@/schema/flaggskipetSchemas";
import type { TiltakspakkeContext } from "@/schema/tiltakspakkeContext";
import { hentTildelingsgrupper } from "../tiltakspakke/hentTildelingsgrupper";
import { fetchOppfolgingsplanOversiktForAG } from "./fetchOppfolgingsplanOversikt";

const ukjentContext: TiltakspakkeContext = {
  gruppe: "ukjent",
  isOppfolgingsplanTiltakspakkeActive: false,
  isDialogmoteTiltakspakkeActive: false,
};

/** Shared per server render; one Flaggskipet call covers every tiltakspakke. */
export const hentTiltakspakkeContext = cache(
  async (narmesteLederId: string): Promise<TiltakspakkeContext> => {
    const oversikt = await fetchOppfolgingsplanOversiktForAG(narmesteLederId);
    if (oversikt.error) return ukjentContext;

    const orgnummer = oversikt.data.organization.orgNumber;
    const isDialogmoteToggleEnabled =
      isDialogmoteTiltakspakkeFeatureToggleEnabled();
    // Pakke 1 assignment still runs with the toggle off, as before the pilot launch.
    const tildelinger = await hentTildelingsgrupper(
      [orgnummer],
      isDialogmoteToggleEnabled
        ? [OPPFOLGINGSPLAN_TILTAKSPAKKE_1, DIALOGMOTE_TILTAKSPAKKE_2]
        : [OPPFOLGINGSPLAN_TILTAKSPAKKE_1],
    );
    const gruppe =
      tildelinger.get(OPPFOLGINGSPLAN_TILTAKSPAKKE_1)?.get(orgnummer) ??
      "ukjent";
    return {
      gruppe,
      isOppfolgingsplanTiltakspakkeActive:
        isTiltakspakkevurderingFeatureToggleEnabled() && gruppe === "tiltak",
      isDialogmoteTiltakspakkeActive:
        isDialogmoteToggleEnabled &&
        tildelinger.get(DIALOGMOTE_TILTAKSPAKKE_2)?.get(orgnummer) === "tiltak",
    };
  },
);
