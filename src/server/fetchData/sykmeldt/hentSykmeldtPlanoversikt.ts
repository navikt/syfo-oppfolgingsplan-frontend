import "server-only";
import { isTiltakspakkevurderingFeatureToggleEnabled } from "@/env-variables/envHelpers";
import { finnOrganisasjonerITiltaksgruppe } from "@/server/fetchData/tiltakspakke/finnOrganisasjonerITiltaksgruppe";
import { fetchOppfolgingsplanOversiktForSM } from "./fetchOppfolgingsplanOversiktForSM";
import { lagSykmeldtPlanoversikt } from "./lagSykmeldtPlanoversikt";

export async function hentSykmeldtPlanoversikt() {
  const oversikt = await fetchOppfolgingsplanOversiktForSM();
  const organisasjonsnumreMedUnntak = oversikt.virksomheter
    .filter(({ oppfolgingsplanhendelser }) =>
      oppfolgingsplanhendelser.some(
        (hendelse) => hendelse.type === "PLAN_IKKE_NODVENDIG",
      ),
    )
    .map(({ organization }) => organization.orgNumber);

  const organisasjonerITiltaksgruppe =
    isTiltakspakkevurderingFeatureToggleEnabled()
      ? await finnOrganisasjonerITiltaksgruppe(organisasjonsnumreMedUnntak)
      : new Set<string>();

  return lagSykmeldtPlanoversikt(oversikt, organisasjonerITiltaksgruppe);
}
