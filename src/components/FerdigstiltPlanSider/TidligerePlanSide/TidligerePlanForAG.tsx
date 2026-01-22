import { HStack, VStack } from "@navikt/ds-react";
import { fetchTidligerePlanForAG } from "@/server/fetchData/arbeidsgiver/fetchTidligerePlan";
import { FormSummaryFromSnapshot } from "@/utils/FormSnapshot/FormSummaryFromSnapshot";
import { VisPdfButtonAG } from "../AktivPlanSide/Buttons/VisPdfButtonAG.tsx";
import TilbakeTilOversiktButtonForAG from "../Shared/Buttons/TilbakeTilOversiktButtonForAG";
import { TidligerePlanDetails } from "./Details/TidligerePlanDetails";
import { TidligerePlanHeadingAndTags } from "./HeadingAndTags/TidligerePlanHeadingAndTags";

interface Props {
  narmesteLederId: string;
  planId: string;
}

export default async function TidligerePlanForAG({
  narmesteLederId,
  planId,
}: Props) {
  const {
    employee,
    oppfolgingsplan: {
      evalueringsDato,
      ferdigstiltTidspunkt,
      deltMedLegeTidspunkt,
      deltMedVeilederTidspunkt,
      content,
    },
  } = await fetchTidligerePlanForAG(narmesteLederId, planId);

  const isDeltMedLege = Boolean(deltMedLegeTidspunkt);
  const isDeltMedVeileder = Boolean(deltMedVeilederTidspunkt);

  return (
    <section>
      <VStack gap="space-32">
        <TidligerePlanHeadingAndTags
          employeeName={employee.name}
          isDeltMedLege={isDeltMedLege}
          isDeltMedVeileder={isDeltMedVeileder}
        />

        <VStack gap="space-16">
          <TidligerePlanDetails
            ferdigstiltTidspunkt={ferdigstiltTidspunkt}
            evalueringsDato={evalueringsDato}
            deltMedLegeTidspunkt={deltMedLegeTidspunkt}
            deltMedVeilederTidspunkt={deltMedVeilederTidspunkt}
          />

          <HStack justify="end">
            <VisPdfButtonAG narmesteLederId={narmesteLederId} planId={planId} />
          </HStack>

          <FormSummaryFromSnapshot formSnapshot={content} />
        </VStack>

        <TilbakeTilOversiktButtonForAG />
      </VStack>
    </section>
  );
}
