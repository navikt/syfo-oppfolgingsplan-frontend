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
import PlanIkkeNodvendigInnslag from "@/components/OversiktSide/PlanListe/PlanIkkeNodvendigInnslag";
import AktivPlanLinkCard from "@/components/OversiktSide/PlanListe/PlanLinkCard/AktivPlanLinkCard";
import TidligerePlanLinkCard from "@/components/OversiktSide/PlanListe/PlanLinkCard/TidligerePlanLinkCard";
import PlanListeDel from "@/components/OversiktSide/PlanListe/PlanListeDel";
import { UnntaksvurderingInfoCard } from "@/components/OversiktSide/PlanListe/UnntaksvurderingInfoCard";
import { hentSykmeldtPlanoversikt } from "@/server/fetchData/sykmeldt/hentSykmeldtPlanoversikt";
import type { SykmeldtPlanoversikt } from "@/server/fetchData/sykmeldt/lagSykmeldtPlanoversikt";
import {
  SykmeldtKontrollgruppeIntroduksjon,
  SykmeldtTiltaksgruppeIntroduksjon,
} from "./SykmeldtOversiktIntroduksjon";
import {
  DetteKanDuBidraMed,
  ForberedelseTilSamtale,
  type ForberedelseTilSamtaleVariant,
} from "./SykmeldtTiltaksgruppeInformasjon";

type SykmeldtOversiktVariant = "kontrollgruppe" | "tiltaksgruppe";

const ingenAktivPlanInnhold = {
  kontrollgruppe: {
    title: "Du har ikke en oppfølgingsplan",
    description:
      "Du kan når som helst be arbeidsgiveren din om å lage en plan.",
  },
  tiltaksgruppe: {
    title: "Du har ikke en aktiv oppfølgingsplan",
    description:
      "Dersom du og lederen din ikke har laget en plan ennå, kan du be om at dere gjør det sammen.",
  },
} satisfies Record<
  SykmeldtOversiktVariant,
  { title: string; description: string }
>;

export default async function OversiktInnholdForSykmeldt() {
  const oversikt = await hentSykmeldtPlanoversikt();

  return oversikt.harMinstEnVirksomhetITiltaksgruppe ? (
    <TiltaksgruppeOversikt oversikt={oversikt} />
  ) : (
    <KontrollgruppeOversikt oversikt={oversikt} />
  );
}

function KontrollgruppeOversikt({
  oversikt,
}: {
  oversikt: SykmeldtPlanoversikt;
}) {
  return (
    <>
      <SykmeldtKontrollgruppeIntroduksjon />
      <SykmeldtPlanListe oversikt={oversikt} variant="kontrollgruppe" />
    </>
  );
}

function TiltaksgruppeOversikt({
  oversikt,
}: {
  oversikt: SykmeldtPlanoversikt;
}) {
  return (
    <>
      <SykmeldtTiltaksgruppeIntroduksjon />
      <DetteKanDuBidraMed />
      <SykmeldtPlanListe oversikt={oversikt} variant="tiltaksgruppe" />
      <ForberedelseTilSamtale variant={finnForberedelseVariant(oversikt)} />
    </>
  );
}

function finnForberedelseVariant({
  gjeldendeHendelser,
}: SykmeldtPlanoversikt): ForberedelseTilSamtaleVariant {
  return gjeldendeHendelser.some(
    ({ hendelse }) => hendelse.type === "PLAN_IKKE_NODVENDIG",
  )
    ? "gjeldende-unntak"
    : "standard";
}

function SykmeldtPlanListe({
  oversikt: { gjeldendeHendelser, tidligereHendelser, harFerdigstiltePlaner },
  variant,
}: {
  oversikt: SykmeldtPlanoversikt;
  variant: SykmeldtOversiktVariant;
}) {
  return (
    <section className="mb-8">
      {gjeldendeHendelser.length === 0 && (
        <IngenAktivPlanAlert variant={variant} />
      )}
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

function IngenAktivPlanAlert({
  variant,
}: {
  variant: SykmeldtOversiktVariant;
}) {
  return (
    <LocalAlert status="announcement" className="mb-8">
      <LocalAlertHeader>
        <LocalAlertTitle as="h3">
          {ingenAktivPlanInnhold[variant].title}
        </LocalAlertTitle>
      </LocalAlertHeader>
      <LocalAlertContent>
        {ingenAktivPlanInnhold[variant].description}
      </LocalAlertContent>
    </LocalAlert>
  );
}
