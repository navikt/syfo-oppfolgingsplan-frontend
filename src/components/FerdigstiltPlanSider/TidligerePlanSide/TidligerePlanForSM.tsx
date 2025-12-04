import { VStack } from "@navikt/ds-react";
import { DeltMedDegAlert } from "@/components/FerdigstiltPlanSider/AktivPlanSide/DeltMedDegAlert.tsx";
import { AktivPlanDetailsSM } from "@/components/FerdigstiltPlanSider/AktivPlanSide/Details/AktivPlanDetailsSM.tsx";
import { AktivPlanHeadingAndTagsSM } from "@/components/FerdigstiltPlanSider/AktivPlanSide/HeadingAndTags/AktivPlanHeadingAndTagsSM.tsx";
import TilbakeTilOversiktButtonForSM from "@/components/FerdigstiltPlanSider/Shared/Buttons/TilbakeTilOversiktButtonForSM";
import { fetchFerdigstiltPlanForSM } from "@/server/fetchData/sykmeldt/fetchFerdigstiltPlanForSM";
import { FormSummaryFromSnapshot } from "@/utils/FormSnapshot/FormSummaryFromSnapshot.tsx";

interface Props {
  planId: string;
}

export default async function TidligerePlanForSM({ planId }: Props) {
  const {
    organization,
    oppfolgingsplan: {
      evalueringsDato,
      ferdigstiltTidspunkt,
      deltMedLegeTidspunkt,
      deltMedVeilederTidspunkt,
      content,
    },
  } = await fetchFerdigstiltPlanForSM(planId);

  const arbeidsstedNavn = organization.orgName ?? organization.orgNumber;

  return (
    <section>
      <VStack gap="8">
        <AktivPlanHeadingAndTagsSM
          arbeidsstedNavn={arbeidsstedNavn}
          isDeltMedLege={Boolean(deltMedLegeTidspunkt)}
          isDeltMedVeileder={Boolean(deltMedVeilederTidspunkt)}
        />

        <AktivPlanDetailsSM
          ferdigstiltTidspunkt={ferdigstiltTidspunkt}
          evalueringsDato={evalueringsDato}
        />

        <FormSummaryFromSnapshot formSnapshot={content} />

        <DeltMedDegAlert />

        <TilbakeTilOversiktButtonForSM />
      </VStack>
    </section>
  );
}
