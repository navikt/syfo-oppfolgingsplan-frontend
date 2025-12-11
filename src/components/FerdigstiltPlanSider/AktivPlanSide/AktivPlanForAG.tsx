import { VStack } from "@navikt/ds-react";
import { ScrollToTopHelper } from "@/components/FerdigstiltPlanSider/AktivPlanSide/ScrollToTopHelper";
import { fetchAktivPlanForAG } from "@/server/fetchData/arbeidsgiver/fetchAktivPlan";
import { FormSummaryFromSnapshot } from "@/utils/FormSnapshot/FormSummaryFromSnapshot";
import TilbakeTilOversiktButtonForAG from "../Shared/Buttons/TilbakeTilOversiktButtonForAG";
import { AktivPlanButtons } from "./Buttons/AktivPlanButtons";
import DelAktivPlanMedLegeEllerNav from "./DelAktivPlan/DelAktivPlanMedLegeEllerNav";
import { AktivPlanDetailsAG } from "./Details/AktivPlanDetailsAG";
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
    userHasEditAccess,
    oppfolgingsplan: {
      id: planId,
      evalueringsDato,
      ferdigstiltTidspunkt,
      deltMedLegeTidspunkt,
      deltMedVeilederTidspunkt,
      content,
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

          <AktivPlanDetailsAG
            nyligOprettet={nyligOpprettet}
            ferdigstiltTidspunkt={ferdigstiltTidspunkt}
            evalueringsDato={evalueringsDato}
          />

          <DelAktivPlanMedLegeEllerNav
            planId={planId}
            userHasEditAccess={userHasEditAccess}
          />

          <AktivPlanButtons
            planId={planId}
            userHasEditAccess={userHasEditAccess}
          />

          <FormSummaryFromSnapshot formSnapshot={content} />

          <TilbakeTilOversiktButtonForAG />
        </PlanDelingProvider>
      </VStack>
    </section>
  );
}
