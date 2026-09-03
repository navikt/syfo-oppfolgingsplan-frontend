import "server-only";
import { isTiltakspakkevurderingFeatureToggleEnabled } from "@/env-variables/envHelpers";
import { finnOrganisasjonerITiltaksgruppe } from "@/server/fetchData/tiltakspakke/finnOrganisasjonerITiltaksgruppe";
import { fetchOppfolgingsplanOversiktForSM } from "./fetchOppfolgingsplanOversiktForSM";
import { lagSykmeldtPlanoversikt } from "./lagSykmeldtPlanoversikt";

export async function hentSykmeldtPlanoversikt() {
  const oversikt = await fetchOppfolgingsplanOversiktForSM();

  const organisasjonerITiltaksgruppe =
    isTiltakspakkevurderingFeatureToggleEnabled()
      ? await finnOrganisasjonerITiltaksgruppe(
          oversikt.virksomhetsnumreMedAktivSykmelding,
        )
      : new Set<string>();

  return lagSykmeldtPlanoversikt(oversikt, organisasjonerITiltaksgruppe);
}
