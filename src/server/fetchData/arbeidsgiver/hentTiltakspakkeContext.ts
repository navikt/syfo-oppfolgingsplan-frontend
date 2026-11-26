import "server-only";
import { cache } from "react";
import { isDialogmoteTiltakspakkeFeatureToggleEnabled } from "@/env-variables/envHelpers";
import { DIALOGMOTE_TILTAKSPAKKE_2 } from "@/schema/flaggskipetSchemas";
import type { TiltakspakkeContext } from "@/schema/tiltakspakkeContext";
import { hentTildelingsgrupper } from "../tiltakspakke/hentTildelingsgrupper";
import { fetchOppfolgingsplanOversiktForAG } from "./fetchOppfolgingsplanOversikt";

const inaktivContext: TiltakspakkeContext = {
  isDialogmoteTiltakspakkeActive: false,
};

/** Shared per server render; only the tiltakspakke 2 group gates the UI. */
export const hentTiltakspakkeContext = cache(
  async (narmesteLederId: string): Promise<TiltakspakkeContext> => {
    if (!isDialogmoteTiltakspakkeFeatureToggleEnabled()) return inaktivContext;

    const oversikt = await fetchOppfolgingsplanOversiktForAG(narmesteLederId);
    if (oversikt.error) return inaktivContext;

    const orgnummer = oversikt.data.organization.orgNumber;
    const tildelinger = await hentTildelingsgrupper([orgnummer]);

    return {
      isDialogmoteTiltakspakkeActive:
        tildelinger[DIALOGMOTE_TILTAKSPAKKE_2].get(orgnummer) === "tiltak",
    };
  },
);
