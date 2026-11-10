import "server-only";
import { isTiltakspakke2FeatureToggleEnabled } from "@/env-variables/envHelpers";
import { DIALOGMOTE_TILTAKSPAKKE_2 } from "@/schema/flaggskipetSchemas";
import { hentTildelingsgrupper } from "../tiltakspakke/hentTildelingsgrupper";
import { fetchOppfolgingsplanOversiktForAG } from "./fetchOppfolgingsplanOversikt";

export async function isDialogmoteTiltakspakkeActive(
  narmesteLederId: string,
): Promise<boolean> {
  if (!isTiltakspakke2FeatureToggleEnabled()) return false;

  const oversikt = await fetchOppfolgingsplanOversiktForAG(narmesteLederId);
  if (oversikt.error) return false;

  const orgnummer = oversikt.data.organization.orgNumber;
  const tildelinger = await hentTildelingsgrupper(
    [orgnummer],
    DIALOGMOTE_TILTAKSPAKKE_2,
  );
  return tildelinger.get(orgnummer) === "tiltak";
}
