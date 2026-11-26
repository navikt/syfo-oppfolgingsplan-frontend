import { VStack } from "@navikt/ds-react";
import { ScrollToTopHelper } from "@/components/FerdigstiltPlanSider/AktivPlanSide/ScrollToTopHelper";
import { fetchAktivPlanForAG } from "@/server/fetchData/arbeidsgiver/fetchAktivPlan";
import { fetchUtkastDataForAG } from "@/server/fetchData/arbeidsgiver/fetchUtkastPlan";
import { FormSummaryFromSnapshot } from "@/utils/FormSnapshot/FormSummaryFromSnapshot";
import TilbakeTilOversiktButtonForAG from "../Shared/Buttons/TilbakeTilOversiktButtonForAG";
import { AktivPlanButtons } from "./Buttons/AktivPlanButtons";
import DelAktivPlanMedLegeEllerNav from "./DelAktivPlan/DelAktivPlanMedLegeEllerNav";
import { AktivPlanDetailsAG } from "./Details/AktivPlanDetailsAG";
import { AktivPlanHeadingAndTags } from "./HeadingAndTags/AktivPlanHeadingAndTags";
import { PlanDelingProvider } from "./PlanDelingContext";

interface Props {
  narmesteLederId: string;
  nyligOpprettet: boolean;
}

export default async function AktivPlanForAG({
  narmesteLederId,
  nyligOpprettet,
}: Props) {
  const aktivPlanPromise = fetchAktivPlanForAG(narmesteLederId);
  const utkastPromise = fetchUtkastDataForAG(narmesteLederId);

  const [
    {
      employee,
      organization,
      userHasEditAccess,
      oppfolgingsplan: {
        id: planId,
        evalueringsDato,
        ferdigstiltTidspunkt,
        stillingstittel,
        stillingsprosent,
        deltMedLegeTidspunkt,
        deltMedVeilederTidspunkt,
        content,
      },
    },
    { utkast },
  ] = await Promise.all([aktivPlanPromise, utkastPromise]);

  const hasUtkast = utkast !== null;
  const orgName = organization.orgName ?? organization.orgNumber;

  return (
    <section>
      {nyligOpprettet && <ScrollToTopHelper />}
      <VStack gap="space-32">
        <PlanDelingProvider
          initialDeltMedLegeTidspunkt={deltMedLegeTidspunkt}
          initialDeltMedVeilederTidspunkt={deltMedVeilederTidspunkt}
        >
          <AktivPlanHeadingAndTags employeeName={employee.name} />

          {userHasEditAccess && (
            <>
              <DelAktivPlanMedLegeEllerNav planId={planId} />

              <AktivPlanButtons planId={planId} hasUtkast={hasUtkast} />
            </>
          )}

          <AktivPlanDetailsAG
            nyligOprettet={nyligOpprettet}
            ferdigstiltTidspunkt={ferdigstiltTidspunkt}
            evalueringsDato={evalueringsDato}
            stillingstittel={stillingstittel}
            stillingsprosent={stillingsprosent}
            orgName={orgName}
          />

          <FormSummaryFromSnapshot formSnapshot={content} />

          <TilbakeTilOversiktButtonForAG />
        </PlanDelingProvider>
      </VStack>
    </section>
  );
}
