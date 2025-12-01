import { VStack } from "@navikt/ds-react";
import { MockOpprettetPlanSummary } from "@/common/components/Summary/MockFerdigstiltPlanSummary";
import { TidligerePlanDetails } from "@/common/components/TidligerePlanDetails";
import { fetchTidligerePlanForSM } from "@/server/fetchData/sykmeldt/fetchTidligerePlanForSM";
import TilbakeTilOversiktButtonForSM from "../TilbakeTilOversiktButtonForSM";
import { TidligerePlanHeadingAndTagsForSM } from "./TidligerePlanHeadingAndTagsForSM";

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
    },
  } = await fetchTidligerePlanForSM({ id: planId });

  const arbeidsstedNavn = organization.orgName ?? organization.orgNumber;

  return (
    <section>
      <VStack gap="8">
        <TidligerePlanHeadingAndTagsForSM
          arbeidsstedNavn={arbeidsstedNavn}
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

          <MockOpprettetPlanSummary />
        </VStack>

        <TilbakeTilOversiktButtonForSM />
      </VStack>
    </section>
  );
}
