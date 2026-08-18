import { InlineMessage, VStack } from "@navikt/ds-react";
import {
  getSMAktivPlanHref,
  getSMTidligerePlanHref,
} from "@/common/route-hrefs";
import { IngenAktivPlanAlert } from "@/components/OversiktSide/IngenAktivPlanAlert";
import { isTiltakspakkevurderingFeatureToggleEnabled } from "@/env-variables/envHelpers";
import type { OppfolgingsplanerOversiktForSM } from "@/schema/oversiktResponseSchemas";
import type {
  SykmeldtUnntaksvurdering,
  UnntaksvurderingMetadata,
} from "@/schema/unntaksvurderingSchemas";
import { erOrgINavTiltaksgruppe } from "@/server/fetchData/arbeidsgiver/erOrgINavTiltaksgruppe";
import { fetchOppfolgingsplanOversiktForSM } from "@/server/fetchData/sykmeldt/fetchOppfolgingsplanOversiktForSM";
import AktivPlanLinkCard from "./PlanLinkCard/AktivPlanLinkCard";
import TidligerePlanLinkCard from "./PlanLinkCard/TidligerePlanLinkCard";
import PlanListeDel from "./PlanListeDel";
import UnntakHistorikkEntry from "./UnntakHistorikkEntry";
import { UnntaksvurderingInfoCard } from "./UnntaksvurderingInfoCard";

type TidligerePlan = OppfolgingsplanerOversiktForSM["tidligerePlaner"][number];

type HistorikkInnslag =
  | { type: "plan"; tidspunkt: string; plan: TidligerePlan }
  | { type: "unntak"; tidspunkt: string; unntak: SykmeldtUnntaksvurdering };

async function finnOrganisasjonerITiltaksgruppe(
  unntaksvurderinger: UnntaksvurderingMetadata[],
): Promise<Set<string>> {
  if (
    !isTiltakspakkevurderingFeatureToggleEnabled() ||
    unntaksvurderinger.length === 0
  ) {
    return new Set();
  }

  const organisasjonsnumre = [
    ...new Set(
      unntaksvurderinger.map(
        (unntaksvurdering) => unntaksvurdering.organization.orgNumber,
      ),
    ),
  ];
  const tiltaksgruppevurderinger = await Promise.all(
    organisasjonsnumre.map(async (organisasjonsnummer) => ({
      organisasjonsnummer,
      erITiltaksgruppe: await erOrgINavTiltaksgruppe(organisasjonsnummer),
    })),
  );
  return new Set(
    tiltaksgruppevurderinger
      .filter(({ erITiltaksgruppe }) => erITiltaksgruppe)
      .map(({ organisasjonsnummer }) => organisasjonsnummer),
  );
}

function tilHistorikkInnslag(
  tidligerePlaner: TidligerePlan[],
  unntaksvurderinger: SykmeldtUnntaksvurdering[],
): HistorikkInnslag[] {
  return [
    ...tidligerePlaner.map((plan) => ({
      type: "plan" as const,
      tidspunkt: plan.ferdigstiltTidspunkt,
      plan,
    })),
    ...unntaksvurderinger.map((unntak) => ({
      type: "unntak" as const,
      tidspunkt: unntak.meldtTidspunkt,
      unntak,
    })),
  ].sort((a, b) => Date.parse(b.tidspunkt) - Date.parse(a.tidspunkt));
}

export default async function PlanListeForSykmeldt() {
  const { aktiveOppfolgingsplaner, tidligerePlaner, unntaksvurderinger } =
    await fetchOppfolgingsplanOversiktForSM();

  const organisasjonerITiltaksgruppe =
    await finnOrganisasjonerITiltaksgruppe(unntaksvurderinger);
  const synligeUnntaksvurderinger = unntaksvurderinger.filter(
    (unntaksvurdering) =>
      organisasjonerITiltaksgruppe.has(unntaksvurdering.organization.orgNumber),
  );
  const synligeGjeldendeUnntaksvurderinger = synligeUnntaksvurderinger.filter(
    (unntaksvurdering) => unntaksvurdering.gjeldende,
  );
  const historikk = tilHistorikkInnslag(
    tidligerePlaner,
    synligeUnntaksvurderinger,
  );

  const harAktivePlaner = aktiveOppfolgingsplaner.length > 0;
  const harGjeldendeUnntaksvurderinger =
    synligeGjeldendeUnntaksvurderinger.length > 0;

  return (
    <section className="mb-8">
      {!harAktivePlaner && !harGjeldendeUnntaksvurderinger && (
        <IngenAktivPlanAlert />
      )}
      {harGjeldendeUnntaksvurderinger && (
        <VStack
          as="section"
          aria-label="Gjeldende vurderinger av oppfølgingsplan"
          gap="space-16"
          className="mb-8"
        >
          {synligeGjeldendeUnntaksvurderinger.map((unntaksvurdering) => (
            <UnntaksvurderingInfoCard
              key={unntaksvurdering.id}
              unntaksvurdering={unntaksvurdering}
            />
          ))}
        </VStack>
      )}
      {harAktivePlaner && (
        <PlanListeDel>
          <VStack gap="space-16">
            {aktiveOppfolgingsplaner.map((plan) => (
              <AktivPlanLinkCard
                key={plan.id}
                aktivPlan={plan}
                linkCardTitle={
                  plan.organization.orgName ?? plan.organization.orgNumber
                }
                href={getSMAktivPlanHref(plan.id)}
              />
            ))}
          </VStack>
        </PlanListeDel>
      )}
      {historikk.length > 0 && (
        <PlanListeDel heading="Historikk">
          <VStack gap="space-16">
            {historikk.map((innslag) =>
              innslag.type === "plan" ? (
                <TidligerePlanLinkCard
                  key={innslag.plan.id}
                  tidligerePlan={innslag.plan}
                  linkCardTitle={
                    innslag.plan.organization.orgName ??
                    innslag.plan.organization.orgNumber
                  }
                  href={getSMTidligerePlanHref(innslag.plan.id)}
                />
              ) : (
                <UnntakHistorikkEntry
                  key={innslag.unntak.id}
                  unntak={innslag.unntak}
                  visOrganisasjon
                />
              ),
            )}
          </VStack>
        </PlanListeDel>
      )}
      {/* Backend derives aktiveOppfolgingsplaner and tidligerePlaner from the same sorted plan lists per employer.
        If tidligerePlaner exists, an active/newest plan also exists. */}
      {harAktivePlaner && (
        <InlineMessage status="info" className="mt-4">
          Aktive og tidligere oppfølgingsplaner blir utilgjengelige når du ikke
          har hatt sykmelding hos arbeidsgiveren på 6 måneder. Åpne planen og
          velg «Vis PDF» for å lagre en kopi.
        </InlineMessage>
      )}
    </section>
  );
}
