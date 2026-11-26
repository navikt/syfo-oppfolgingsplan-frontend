import { InlineMessage, LocalAlert, VStack } from "@navikt/ds-react";
import {
  LocalAlertContent,
  LocalAlertHeader,
  LocalAlertTitle,
} from "@navikt/ds-react/LocalAlert";
import {
  getSMAktivPlanHref,
  getSMTidligerePlanHref,
} from "@/common/route-hrefs";
import { UnntakLumiSurvey } from "@/components/LumiSurvey/UnntakLumiSurvey";
import PlanIkkeNodvendigInnslag from "@/components/OversiktSide/PlanListe/PlanIkkeNodvendigInnslag";
import AktivPlanLinkCard from "@/components/OversiktSide/PlanListe/PlanLinkCard/AktivPlanLinkCard";
import TidligerePlanLinkCard from "@/components/OversiktSide/PlanListe/PlanLinkCard/TidligerePlanLinkCard";
import PlanListeDel from "@/components/OversiktSide/PlanListe/PlanListeDel";
import { UnntaksvurderingInfoCard } from "@/components/OversiktSide/PlanListe/UnntaksvurderingInfoCard";
import { isLocalOrDemo } from "@/env-variables/envHelpers";
import { hentSykmeldtPlanoversikt } from "@/server/fetchData/sykmeldt/hentSykmeldtPlanoversikt";
import type { SykmeldtPlanoversikt } from "@/server/fetchData/sykmeldt/lagSykmeldtPlanoversikt";
import {
  DetteKanDuBidraMed,
  ForberedelseTilSamtale,
} from "./SykmeldtInformasjon";
import { SykmeldtIntroduksjon } from "./SykmeldtOversiktIntroduksjon";

export default async function OversiktInnholdForSykmeldt() {
  const oversikt = await hentSykmeldtPlanoversikt();
  const harUnntak = harGjeldendeUnntak(oversikt);

  return (
    <>
      <SykmeldtIntroduksjon />
      <DetteKanDuBidraMed />
      <SykmeldtPlanListe oversikt={oversikt} />
      <ForberedelseTilSamtale
        variant={harUnntak ? "gjeldende-unntak" : "standard"}
      />
      {/* Lumi API is not connected yet, so the survey is local and demo only. */}
      {isLocalOrDemo && harUnntak && <UnntakLumiSurvey />}
    </>
  );
}

function harGjeldendeUnntak({
  gjeldendeHendelser,
}: SykmeldtPlanoversikt): boolean {
  return gjeldendeHendelser.some(
    ({ hendelse }) => hendelse.type === "PLAN_IKKE_NODVENDIG",
  );
}

function SykmeldtPlanListe({
  oversikt: { gjeldendeHendelser, tidligereHendelser, harFerdigstiltePlaner },
}: {
  oversikt: SykmeldtPlanoversikt;
}) {
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

function IngenAktivPlanAlert() {
  return (
    <LocalAlert status="announcement" className="mb-8">
      <LocalAlertHeader>
        <LocalAlertTitle as="h3">
          Du har ikke en aktiv oppfølgingsplan
        </LocalAlertTitle>
      </LocalAlertHeader>
      <LocalAlertContent>
        Dersom du og lederen din ikke har laget en plan ennå, kan du be om at
        dere gjør det sammen.
      </LocalAlertContent>
    </LocalAlert>
  );
}
