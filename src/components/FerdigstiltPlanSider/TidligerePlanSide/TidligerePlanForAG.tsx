import { HStack, VStack } from "@navikt/ds-react";
import { fetchTidligerePlanForAG } from "@/server/fetchData/arbeidsgiver/fetchTidligerePlan";
import { FerdigstiltPlanHeadingAndTags } from "../FerdigstiltPlanHeadingAndTags";
import { LastNedSomPdfButton } from "../LastNedSomPdfButton";
import { MockOpprettetPlanSummary } from "../MockFerdigstiltPlanSummary";
import TilbakeTilOversiktButtonForAG from "../TilbakeTilOversiktButtonForAG";
import { TidligerePlanDetails } from "./TidligerePlanDetails";

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
        <FerdigstiltPlanHeadingAndTags
          employeeName={employee.name}
          isDeltMedLege={Boolean(deltMedLegeTidspunkt)}
          isDeltMedNav={Boolean(deltMedVeilederTidspunkt)}
        />

        <VStack gap="4">
          <TidligerePlanDetails
            ferdigstiltTidspunkt={ferdigstiltTidspunkt}
            evalueringsDato={evalueringsDato}
            deltMedLegeTidspunkt={deltMedLegeTidspunkt}
            deltMedVeilederTidspunkt={deltMedVeilederTidspunkt}
          />

          <HStack justify="end">
            <LastNedSomPdfButton />
          </HStack>

          <MockOpprettetPlanSummary />
        </VStack>

        <TilbakeTilOversiktButtonForAG />
      </VStack>
    </section>
  );
}
