import { HStack, VStack } from "@navikt/ds-react";
import { fetchTidligerePlanForAG } from "@/server/fetchData/arbeidsgiver/fetchTidligerePlan";
import { FormSummaryFromSnapshot } from "@/utils/FormSnapshot/FormSummaryFromSnapshot";
import { LastNedSomPdfButton } from "../Shared/Buttons/LastNedSomPdfButton";
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

  return (
    <section>
      <VStack gap="8">
        <TidligerePlanHeadingAndTags
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
            <LastNedSomPdfButton
              narmesteLederId={narmesteLederId}
              planId={planId}
            />
          </HStack>

          <FormSummaryFromSnapshot formSnapshot={content} />
        </VStack>

        <TilbakeTilOversiktButtonForAG />
      </VStack>
    </section>
  );
}
