import "server-only";
import { cache } from "react";
import { isTiltakspakkevurderingFeatureToggleEnabled } from "@/env-variables/envHelpers";
import type { TiltakspakkeContext } from "@/schema/tiltakspakkeContext";
import { hentTildelingsgrupper } from "../tiltakspakke/hentTildelingsgrupper";
import { fetchOppfolgingsplanOversiktForAG } from "./fetchOppfolgingsplanOversikt";

/** Shared per server render, including callers that only need the UI flag. */
export const hentTiltakspakkeContext = cache(
  async (narmesteLederId: string): Promise<TiltakspakkeContext> => {
    const oversikt = await fetchOppfolgingsplanOversiktForAG(narmesteLederId);
    if (oversikt.error) return { gruppe: "ukjent", erITiltaksgruppe: false };

    const orgnummer = oversikt.data.organization.orgNumber;
    // Assignment still runs with the toggle off, as before the pilot launch.
    const tildelinger = await hentTildelingsgrupper([orgnummer]);
    const gruppe = tildelinger.get(orgnummer) ?? "ukjent";
    return {
      gruppe,
      erITiltaksgruppe:
        isTiltakspakkevurderingFeatureToggleEnabled() && gruppe === "tiltak",
    };
  },
);
