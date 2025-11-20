import { VStack } from "@navikt/ds-react";
import { ScrollToTopHelper } from "@/components/FerdigstiltPlanSider/AktivPlanSide/ScrollToTopHelper";
import { fetchAktivPlanForAG } from "@/server/fetchData/arbeidsgiver/fetchAktivPlan";
import TilbakeTilOversiktButtonForAG from "../Shared/Buttons/TilbakeTilOversiktButtonForAG";
import { MockOpprettetPlanSummary } from "../Shared/Summary/MockFerdigstiltPlanSummary";
import { AktivPlanButtons } from "./Buttons/AktivPlanButtons";
import DelAktivPlanMedLegeEllerNav from "./DelAktivPlan/DelAktivPlanMedLegeEllerNav";
import { AktivPlanDetails } from "./Details/AktivPlanDetails";
import { AktivPlanHeadingAndTags } from "./HeadingAndTags/AktivPlanHeadingAndTags";
import { PlanDelingProvider } from "./PlanDelingContext";

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
      {nyligOpprettet && <ScrollToTopHelper />}

      <VStack gap="8">
        <PlanDelingProvider
          initialDeltMedLegeTidspunkt={deltMedLegeTidspunkt}
          initialDeltMedVeilederTidspunkt={deltMedVeilederTidspunkt}
        >
          <AktivPlanHeadingAndTags employeeName={employee.name} />

          <AktivPlanDetails
            nyligOprettet={nyligOpprettet}
            ferdigstiltTidspunkt={ferdigstiltTidspunkt}
            evalueringsDato={evalueringsDato}
          />

          <DelAktivPlanMedLegeEllerNav planId={planId} />

          <AktivPlanButtons narmesteLederId={narmesteLederId} />

          {/* TODO */}
          <MockOpprettetPlanSummary />

          <TilbakeTilOversiktButtonForAG />
        </PlanDelingProvider>
      </VStack>
    </section>
  );
}
