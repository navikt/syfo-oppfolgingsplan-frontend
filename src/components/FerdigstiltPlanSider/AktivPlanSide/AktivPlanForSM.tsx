import { HStack, VStack } from "@navikt/ds-react";
import { VisPdfButtonSM } from "@/components/FerdigstiltPlanSider/AktivPlanSide/Buttons/VisPdfButtonSM";
import { AktivPlanDetailsSM } from "@/components/FerdigstiltPlanSider/AktivPlanSide/Details/AktivPlanDetailsSM";
import { IkkeMedvirketInfoCard } from "@/components/FerdigstiltPlanSider/AktivPlanSide/IkkeMedvirketInfoCard";
import { MedvirketInfoCard } from "@/components/FerdigstiltPlanSider/AktivPlanSide/MedvirketInfoCard";
import TilbakeTilOversiktButtonForSM from "@/components/FerdigstiltPlanSider/Shared/Buttons/TilbakeTilOversiktButtonForSM";
import { fetchFerdigstiltPlanForSM } from "@/server/fetchData/sykmeldt/fetchFerdigstiltPlanForSM";
import { FormSummaryFromSnapshot } from "@/utils/FormSnapshot/FormSummaryFromSnapshot";
import { hasMedvirket } from "@/utils/planUtils";
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
      stillingstittel,
      stillingsprosent,
      deltMedLegeTidspunkt,
      deltMedVeilederTidspunkt,
      content,
    },
  } = await fetchFerdigstiltPlanForSM(planId);

  const arbeidsstedNavn = organization.orgName ?? organization.orgNumber;
  const isDeltMedLege = Boolean(deltMedLegeTidspunkt);
  const isDeltMedVeileder = Boolean(deltMedVeilederTidspunkt);

  return (
    <section>
      <VStack gap="space-32">
        <AktivPlanHeadingAndTagsSM
          arbeidsstedNavn={arbeidsstedNavn}
          isDeltMedVeileder={isDeltMedVeileder}
          isDeltMedLege={isDeltMedLege}
        />
        {!hasMedvirket(content) && (
          <IkkeMedvirketInfoCard isDeltMedVeileder={isDeltMedVeileder} />
        )}
        <HStack>
          <AktivPlanDetailsSM
            ferdigstiltTidspunkt={ferdigstiltTidspunkt}
            evalueringsDato={evalueringsDato}
            stillingstittel={stillingstittel}
            stillingsprosent={stillingsprosent}
            orgName={arbeidsstedNavn}
          />

          <VisPdfButtonSM planId={planId} className="ml-auto" />
        </HStack>

        <FormSummaryFromSnapshot formSnapshot={content} />

        {hasMedvirket(content) && (
          <MedvirketInfoCard isDeltMedVeileder={isDeltMedVeileder} />
        )}

        <TilbakeTilOversiktButtonForSM />
      </VStack>
    </section>
  );
}
