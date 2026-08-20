import { InlineMessage, VStack } from "@navikt/ds-react";
import {
  getSMAktivPlanHref,
  getSMTidligerePlanHref,
} from "@/common/route-hrefs";
import { IngenAktivPlanAlert } from "@/components/OversiktSide/IngenAktivPlanAlert";
import { hentSykmeldtPlanoversikt } from "@/server/fetchData/sykmeldt/hentSykmeldtPlanoversikt";
import PlanIkkeNodvendigInnslag from "./PlanIkkeNodvendigInnslag";
import AktivPlanLinkCard from "./PlanLinkCard/AktivPlanLinkCard";
import TidligerePlanLinkCard from "./PlanLinkCard/TidligerePlanLinkCard";
import PlanListeDel from "./PlanListeDel";
import { UnntaksvurderingInfoCard } from "./UnntaksvurderingInfoCard";

export default async function PlanListeForSykmeldt() {
  const { gjeldendeHendelser, tidligereHendelser, harFerdigstiltePlaner } =
    await hentSykmeldtPlanoversikt();

  return (
    <section className="mb-8">
      {gjeldendeHendelser.length === 0 && <IngenAktivPlanAlert />}
      {gjeldendeHendelser.length > 0 && (
        <PlanListeDel>
          <VStack gap="space-16">
            {gjeldendeHendelser.map(({ organization, hendelse }) =>
              hendelse.type === "FERDIGSTILT_PLAN" ? (
                <AktivPlanLinkCard
                  key={hendelse.id}
                  aktivPlan={hendelse}
                  linkCardTitle={organization.orgName ?? organization.orgNumber}
                  href={getSMAktivPlanHref(hendelse.id)}
                />
              ) : (
                <UnntaksvurderingInfoCard
                  key={hendelse.id}
                  unntaksvurdering={{ ...hendelse, organization }}
                />
              ),
            )}
          </VStack>
        </PlanListeDel>
      )}
      {tidligereHendelser.length > 0 && (
        <PlanListeDel heading="Tidligere oppfølgingsplaner">
          <VStack gap="space-16">
            {tidligereHendelser.map(({ organization, hendelse }) =>
              hendelse.type === "FERDIGSTILT_PLAN" ? (
                <TidligerePlanLinkCard
                  key={hendelse.id}
                  tidligerePlan={hendelse}
                  linkCardTitle={organization.orgName ?? organization.orgNumber}
                  href={getSMTidligerePlanHref(hendelse.id)}
                />
              ) : (
                <PlanIkkeNodvendigInnslag
                  key={hendelse.id}
                  unntak={{ ...hendelse, organization }}
                  visOrganisasjon
                />
              ),
            )}
          </VStack>
        </PlanListeDel>
      )}
      {harFerdigstiltePlaner && (
        <InlineMessage status="info" className="mt-4">
          Aktive og tidligere oppfølgingsplaner blir utilgjengelige når du ikke
          har hatt sykmelding hos arbeidsgiveren på 6 måneder. Åpne planen og
          velg «Vis PDF» for å lagre en kopi.
        </InlineMessage>
      )}
    </section>
  );
}
