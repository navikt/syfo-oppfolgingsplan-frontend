import { VStack } from "@navikt/ds-react";
import { ScrollToTopHelper } from "@/components/FerdigstiltPlanSider/AktivPlanSide/ScrollToTopHelper";
import { fetchAktivPlanForAG } from "@/server/fetchData/arbeidsgiver/fetchAktivPlan";
import { FerdigstiltPlanHeadingAndTags } from "../FerdigstiltPlanHeadingAndTags";
import { MockOpprettetPlanSummary } from "../MockFerdigstiltPlanSummary";
import TilbakeTilOversiktButtonForAG from "../TilbakeTilOversiktButtonForAG";
import { AktivPlanButtons } from "./AktivPlanButtons";
import { AktivPlanDetails } from "./AktivPlanDetails";
import DelAktivPlanMedLegeEllerNav from "./DelAktivPlanMedLegeEllerNav";

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
    oppfolgingsplan: {
      evalueringsDato,
      ferdigstiltTidspunkt,
      deltMedLegeTidspunkt,
      deltMedVeilederTidspunkt,
    },
  } = await fetchAktivPlanForAG(narmesteLederId);

  return (
    <section>
      {nyligOpprettet && <ScrollToTopHelper />}

      <VStack gap="8">
        <FerdigstiltPlanHeadingAndTags
          employeeName={employee.name}
          isDeltMedLege={Boolean(deltMedLegeTidspunkt)}
          isDeltMedNav={Boolean(deltMedVeilederTidspunkt)}
        />

        <AktivPlanDetails
          nyligOprettet={nyligOpprettet}
          ferdigstiltTidspunkt={ferdigstiltTidspunkt}
          evalueringsDato={evalueringsDato}
        />

        <DelAktivPlanMedLegeEllerNav
          deltMedLegeTidspunkt={deltMedLegeTidspunkt}
          deltMedVeilederTidspunkt={deltMedVeilederTidspunkt}
        />

        <AktivPlanButtons narmesteLederId={narmesteLederId} />

        {/* TODO */}
        <MockOpprettetPlanSummary />

        <TilbakeTilOversiktButtonForAG />
      </VStack>
    </section>
  );
}
