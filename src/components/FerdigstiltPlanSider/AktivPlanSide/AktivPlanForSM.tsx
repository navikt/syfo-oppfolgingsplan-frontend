import { VStack } from "@navikt/ds-react";
import { AktivPlanDetailsSM } from "@/components/FerdigstiltPlanSider/AktivPlanSide/Details/AktivPlanDetailsSM";
import TilbakeTilOversiktButtonForSM from "@/components/FerdigstiltPlanSider/Shared/Buttons/TilbakeTilOversiktButtonForSM";
import { fetchFerdigstiltPlanForSM } from "@/server/fetchData/sykmeldt/fetchFerdigstiltPlanForSM";
import { FormSummaryFromSnapshot } from "@/utils/FormSnapshot/FormSummaryFromSnapshot.tsx";
import { DeltMedDegAlert } from "./DeltMedDegAlert";
import { AktivPlanHeadingAndTagsSM } from "./HeadingAndTags/AktivPlanHeadingAndTagsSM";

interface Props {
  planId: string;
}

export default async function AktivPlanForSM({ planId }: Props) {
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
          isDeltMedVeileder={Boolean(deltMedVeilederTidspunkt)}
          isDeltMedLege={Boolean(deltMedLegeTidspunkt)}
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
