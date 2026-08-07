import { InlineMessage, VStack } from "@navikt/ds-react";
import {
  getAGAktivPlanHref,
  getAGTidligerePlanHref,
} from "@/common/route-hrefs";
import type { OppfolgingsplanerOversiktForAG } from "@/schema/oversiktResponseSchemas";
import type { UnntaksvurderingMetadata } from "@/schema/unntaksvurderingSchemas";
import { fetchOppfolgingsplanOversiktForAG } from "@/server/fetchData/arbeidsgiver/fetchOppfolgingsplanOversikt";
import { FetchErrorAlert } from "@/ui/FetchErrorAlert";
import AktivPlanLinkCard from "./PlanLinkCard/AktivPlanLinkCard";
import TidligerePlanLinkCard from "./PlanLinkCard/TidligerePlanLinkCard";
import UtkastLinkPanel from "./PlanLinkCard/UtkastLinkCard";
import PlanListeDel from "./PlanListeDel";
import { SlettUtkastButtonAndModal } from "./SlettUtkast/SlettUtkastButtonAndModal";
import UnntakHistorikkEntry from "./UnntakHistorikkEntry";

interface Props {
  narmesteLederId: string;
}

type TidligerePlan =
  OppfolgingsplanerOversiktForAG["oversikt"]["tidligerePlaner"][number];

type HistorikkInnslag =
  | { type: "plan"; tidspunkt: string; plan: TidligerePlan }
  | { type: "unntak"; tidspunkt: string; unntak: UnntaksvurderingMetadata };

/**
 * Sidestiller tidligere planer og meldte unntaksvurderinger kronologisk,
 * nyeste først. Rent presentasjonsvalg — listene holdes atskilt i kontrakten,
 * og unntak skal aldri påvirke gatingen av «Lag ny plan».
 */
function tilHistorikkInnslag(
  tidligerePlaner: TidligerePlan[],
  unntaksvurderinger: UnntaksvurderingMetadata[],
): HistorikkInnslag[] {
  const innslag: HistorikkInnslag[] = [
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
  ];

  return innslag.sort(
    (a, b) => Date.parse(b.tidspunkt) - Date.parse(a.tidspunkt),
  );
}

export default async function PlanListeForArbeidsgiver({
  narmesteLederId,
}: Props) {
  const oversiktResult =
    await fetchOppfolgingsplanOversiktForAG(narmesteLederId);

  if (oversiktResult.error) {
    return (
      <section className="mb-8">
        <FetchErrorAlert error={oversiktResult.error} />
      </section>
    );
  }

  const {
    organization: { orgName },
    oversikt: { aktivPlan, tidligerePlaner, utkast, unntaksvurderinger },
  } = oversiktResult.data;

  const historikk = tilHistorikkInnslag(tidligerePlaner, unntaksvurderinger);
  const harUnntak = unntaksvurderinger.length > 0;

  const linkCardTitle = orgName || "Oppfølgingsplan";

  // «Tidligere oppfølgingsplaner» er faktuelt feil når seksjonen (også)
  // inneholder unntak — da brukes en nøytral overskrift.
  const historikkHeading = harUnntak
    ? "Historikk"
    : "Tidligere oppfølgingsplaner";

  return (
    <section className="mb-12">
      {aktivPlan && (
        <PlanListeDel>
          <AktivPlanLinkCard
            aktivPlan={aktivPlan}
            linkCardTitle={linkCardTitle}
            href={getAGAktivPlanHref(narmesteLederId)}
          />
        </PlanListeDel>
      )}
      {utkast && (
        <PlanListeDel heading="Oppfølgingsplan under arbeid">
          <VStack gap="space-16">
            <UtkastLinkPanel
              utkast={utkast}
              linkCardTitle={linkCardTitle}
              narmesteLederId={narmesteLederId}
            />

            <SlettUtkastButtonAndModal />
          </VStack>
        </PlanListeDel>
      )}
      {historikk.length > 0 && (
        <PlanListeDel heading={historikkHeading}>
          <VStack gap="space-16">
            {historikk.map((innslag) =>
              innslag.type === "plan" ? (
                <TidligerePlanLinkCard
                  key={innslag.plan.id}
                  tidligerePlan={innslag.plan}
                  linkCardTitle={linkCardTitle}
                  href={getAGTidligerePlanHref(
                    narmesteLederId,
                    innslag.plan.id,
                  )}
                />
              ) : (
                <UnntakHistorikkEntry
                  key={innslag.unntak.id}
                  unntak={innslag.unntak}
                />
              ),
            )}
          </VStack>
        </PlanListeDel>
      )}
      {/* Backend derives aktivPlan and tidligerePlaner from the same sorted plan list.
        If tidligerePlaner exists, aktivPlan also exists. */}
      {aktivPlan && (
        <InlineMessage status="info" className="mt-4">
          Aktive og tidligere oppfølgingsplaner blir utilgjengelige når den
          ansatte ikke har hatt sykmelding hos dere på 6 måneder.
        </InlineMessage>
      )}
    </section>
  );
}
