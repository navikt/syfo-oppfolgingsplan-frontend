import { HStack, VStack } from "@navikt/ds-react";
import { MockOpprettetPlanSummary } from "@/common/components/Summary/MockFerdigstiltPlanSummary";
import { TidligerePlanDetails } from "@/common/components/TidligerePlanDetails";
import { fetchTidligerePlanForAG } from "@/server/fetchData/arbeidsgiver/fetchTidligerePlanForAG";
import { LastNedSomPdfButtonForAG } from "../LastNedSomPdfButtonForAG";
import TilbakeTilOversiktButtonForAG from "../TilbakeTilOversiktButtonForAG";
import { TidligerePlanHeadingAndTagsForAG } from "./TidligerePlanHeadingAndTagsForAG";

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
    },
  } = await fetchTidligerePlanForAG(narmesteLederId, planId);

  return (
    <section>
      <VStack gap="8">
        <TidligerePlanHeadingAndTagsForAG
          employeeName={employee.name}
          isDeltMedLege={Boolean(deltMedLegeTidspunkt)}
          isDeltMedVeileder={Boolean(deltMedVeilederTidspunkt)}
        />

        <VStack gap="4">
          <TidligerePlanDetails
            ferdigstiltTidspunkt={ferdigstiltTidspunkt}
            evalueringsDato={evalueringsDato}
            deltMedLegeTidspunkt={deltMedLegeTidspunkt}
            deltMedVeilederTidspunkt={deltMedVeilederTidspunkt}
          />

          <HStack justify="end">
            <LastNedSomPdfButtonForAG />
          </HStack>

          <MockOpprettetPlanSummary />
        </VStack>

        <TilbakeTilOversiktButtonForAG />
      </VStack>
    </section>
  );
}
