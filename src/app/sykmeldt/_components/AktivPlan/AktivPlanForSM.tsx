import { VStack } from "@navikt/ds-react";
import { MockOpprettetPlanSummary } from "@/common/components/Summary/MockFerdigstiltPlanSummary";
import { fetchAktivPlanForSM } from "@/server/fetchData/sykmeldt/fetchAktivPlanForSM";
import TilbakeTilOversiktButtonForSM from "../TilbakeTilOversiktButtonForSM";
import { AktivPlanDetailsForSM } from "./AktivPlanDetailsForSM";
import { AktivPlanHeadingAndTagsForSM } from "./AktivPlanHeadingAndTagsForSM";
import { DeltMedDegAlert } from "./DeltMedDegAlert";
import { PlanDelingStatusProviderSM } from "./PlanDelingStatusContextForSM";

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
    },
  } = await fetchAktivPlanForSM({ id: planId });

  const arbeidsstedNavn = organization.orgName ?? organization.orgNumber;

  return (
    <section>
      <VStack gap="8">
        <PlanDelingStatusProviderSM
          deltMedLegeTidspunkt={deltMedLegeTidspunkt}
          deltMedVeilederTidspunkt={deltMedVeilederTidspunkt}
        >
          <AktivPlanHeadingAndTagsForSM arbeidsstedNavn={arbeidsstedNavn} />

          <AktivPlanDetailsForSM
            ferdigstiltTidspunkt={ferdigstiltTidspunkt}
            evalueringsDato={evalueringsDato}
          />

          {/* TODO */}
          <MockOpprettetPlanSummary />

          <DeltMedDegAlert />

          <TilbakeTilOversiktButtonForSM />
        </PlanDelingStatusProviderSM>
      </VStack>
    </section>
  );
}
