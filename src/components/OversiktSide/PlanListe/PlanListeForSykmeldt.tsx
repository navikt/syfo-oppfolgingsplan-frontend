import { InlineMessage, VStack } from "@navikt/ds-react";
import {
  getSMAktivPlanHref,
  getSMTidligerePlanHref,
} from "@/common/route-hrefs";
import { IngenAktivPlanAlert } from "@/components/OversiktSide/IngenAktivPlanAlert";
import { isTiltakspakkevurderingFeatureToggleEnabled } from "@/env-variables/envHelpers";
import type { OppfolgingsplanerOversiktForSM } from "@/schema/oversiktResponseSchemas";
import type { UnntaksvurderingMetadata } from "@/schema/unntaksvurderingSchemas";
import { erOrgINavTiltaksgruppe } from "@/server/fetchData/arbeidsgiver/erOrgINavTiltaksgruppe";
import { fetchOppfolgingsplanOversiktForSM } from "@/server/fetchData/sykmeldt/fetchOppfolgingsplanOversiktForSM";
import AktivPlanLinkCard from "./PlanLinkCard/AktivPlanLinkCard";
import TidligerePlanLinkCard from "./PlanLinkCard/TidligerePlanLinkCard";
import PlanListeDel from "./PlanListeDel";
import UnntakHistorikkEntry from "./UnntakHistorikkEntry";
import { UnntaksvurderingInfoCard } from "./UnntaksvurderingInfoCard";

type AktivPlan =
  OppfolgingsplanerOversiktForSM["aktiveOppfolgingsplaner"][number];
type TidligerePlan = OppfolgingsplanerOversiktForSM["tidligerePlaner"][number];

type HistorikkInnslag =
  | { type: "plan"; tidspunkt: string; plan: TidligerePlan }
  | { type: "unntak"; tidspunkt: string; unntak: UnntaksvurderingMetadata };

async function filtrerUnntaksvurderingerForTiltaksgruppe(
  unntaksvurderinger: UnntaksvurderingMetadata[],
): Promise<UnntaksvurderingMetadata[]> {
  if (
    !isTiltakspakkevurderingFeatureToggleEnabled() ||
    unntaksvurderinger.length === 0
  ) {
    return [];
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
  const organisasjonerITiltaksgruppe = new Set(
    tiltaksgruppevurderinger
      .filter(({ erITiltaksgruppe }) => erITiltaksgruppe)
      .map(({ organisasjonsnummer }) => organisasjonsnummer),
  );

  return unntaksvurderinger.filter((unntaksvurdering) =>
    organisasjonerITiltaksgruppe.has(unntaksvurdering.organization.orgNumber),
  );
}

function finnGjeldendeUnntaksvurderinger(
  aktiveOppfolgingsplaner: AktivPlan[],
  unntaksvurderinger: UnntaksvurderingMetadata[],
): UnntaksvurderingMetadata[] {
  const nyestePlanTidspunktPerOrganisasjon = new Map<string, number>();

  for (const plan of aktiveOppfolgingsplaner) {
    const organisasjonsnummer = plan.organization.orgNumber;
    const tidspunkt = Date.parse(plan.ferdigstiltTidspunkt);
    const eksisterendeTidspunkt =
      nyestePlanTidspunktPerOrganisasjon.get(organisasjonsnummer);

    if (
      eksisterendeTidspunkt === undefined ||
      tidspunkt > eksisterendeTidspunkt
    ) {
      nyestePlanTidspunktPerOrganisasjon.set(organisasjonsnummer, tidspunkt);
    }
  }

  const nyesteUnntakPerOrganisasjon = new Map<
    string,
    UnntaksvurderingMetadata
  >();

  for (const unntaksvurdering of unntaksvurderinger) {
    const organisasjonsnummer = unntaksvurdering.organization.orgNumber;
    const eksisterende = nyesteUnntakPerOrganisasjon.get(organisasjonsnummer);

    if (
      !eksisterende ||
      Date.parse(unntaksvurdering.meldtTidspunkt) >
        Date.parse(eksisterende.meldtTidspunkt)
    ) {
      nyesteUnntakPerOrganisasjon.set(organisasjonsnummer, unntaksvurdering);
    }
  }

  return [...nyesteUnntakPerOrganisasjon.values()]
    .filter((unntaksvurdering) => {
      const nyestePlanTidspunkt = nyestePlanTidspunktPerOrganisasjon.get(
        unntaksvurdering.organization.orgNumber,
      );

      return (
        nyestePlanTidspunkt === undefined ||
        Date.parse(unntaksvurdering.meldtTidspunkt) > nyestePlanTidspunkt
      );
    })
    .sort(
      (a, b) => Date.parse(b.meldtTidspunkt) - Date.parse(a.meldtTidspunkt),
    );
}

function tilHistorikkInnslag(
  tidligerePlaner: TidligerePlan[],
  unntaksvurderinger: UnntaksvurderingMetadata[],
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

  const synligeUnntaksvurderinger =
    await filtrerUnntaksvurderingerForTiltaksgruppe(unntaksvurderinger);
  const gjeldendeUnntaksvurderinger = finnGjeldendeUnntaksvurderinger(
    aktiveOppfolgingsplaner,
    synligeUnntaksvurderinger,
  );
  const historikk = tilHistorikkInnslag(
    tidligerePlaner,
    synligeUnntaksvurderinger,
  );

  const harAktivePlaner = aktiveOppfolgingsplaner.length > 0;
  const harGjeldendeUnntaksvurderinger = gjeldendeUnntaksvurderinger.length > 0;

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
          {gjeldendeUnntaksvurderinger.map((unntaksvurdering) => (
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
