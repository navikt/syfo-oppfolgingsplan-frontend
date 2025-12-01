import { VStack } from "@navikt/ds-react";
import { MockOpprettetPlanSummary } from "@/common/components/Summary/MockFerdigstiltPlanSummary";
import { fetchAktivPlanForAG } from "@/server/fetchData/arbeidsgiver/fetchAktivPlanForAG";
import { ScrollToTopHelperForAG } from "../ScrollToTopHelperForAG";
import TilbakeTilOversiktButtonForAG from "../TilbakeTilOversiktButtonForAG";
import { AktivPlanButtons } from "./AktivPlanButtons";
import { AktivPlanDetailsForAG } from "./AktivPlanDetailsForAG";
import { AktivPlanHeadingAndTagsForAG } from "./AktivPlanHeadingAndTagsForAG";
import DelAktivPlanMedLegeEllerNav from "./DelAktivPlan/DelAktivPlanMedLegeEllerNav";
import { PlanDelingProviderAG } from "./PlanDelingContextForAG";

interface Props {
  narmesteLederId: string;
  nyligOpprettet: boolean;
}

export default async function AktivPlanForAG({
  narmesteLederId,
  nyligOpprettet,
}: Props) {
  const {
    employee,
    oppfolgingsplan: {
      id: planId,
      evalueringsDato,
      ferdigstiltTidspunkt,
      deltMedLegeTidspunkt,
      deltMedVeilederTidspunkt,
    },
  } = await fetchAktivPlanForAG(narmesteLederId);

  return (
    <section>
      {nyligOpprettet && <ScrollToTopHelperForAG />}

      <VStack gap="8">
        <PlanDelingProviderAG
          initialDeltMedLegeTidspunkt={deltMedLegeTidspunkt}
          initialDeltMedVeilederTidspunkt={deltMedVeilederTidspunkt}
        >
          <AktivPlanHeadingAndTagsForAG employeeName={employee.name} />

          <AktivPlanDetailsForAG
            nyligOprettet={nyligOpprettet}
            ferdigstiltTidspunkt={ferdigstiltTidspunkt}
            evalueringsDato={evalueringsDato}
          />

          <DelAktivPlanMedLegeEllerNav planId={planId} />

          <AktivPlanButtons narmesteLederId={narmesteLederId} />

          {/* TODO */}
          <MockOpprettetPlanSummary />

          <TilbakeTilOversiktButtonForAG />
        </PlanDelingProviderAG>
      </VStack>
    </section>
  );
}
