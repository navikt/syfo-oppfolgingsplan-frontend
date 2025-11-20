import { FerdigstiltPlanMetadata } from "@/schema/ferdigstiltPlanMetadataSchema";
import PlanLinkCard from "./PlanLinkCard";
import PlanLinkCardDelingStatusFooterTags from "./PlanLinkCardFooterTags";

interface Props {
  aktivPlan: FerdigstiltPlanMetadata;
  arbeidsstedNavn: string;
  href: string;
}

export default function AktivPlanLinkCard({
  aktivPlan,
  arbeidsstedNavn,
  href,
}: Props) {
  return (
    <PlanLinkCard
      href={href}
      planMetadata={aktivPlan}
      arbeidsstedNavn={arbeidsstedNavn}
      footerContent={
        <PlanLinkCardDelingStatusFooterTags
          isDeltMedLege={aktivPlan.deltMedLegeTidspunkt !== null}
          isDeltMedNav={aktivPlan.deltMedVeilederTidspunkt !== null}
          tagVariantHvisDelt="success-moderate"
          tagVariantHvisIkkeDelt="neutral-moderate"
          tagSize="small"
        />
      }
      className="bg-ax-bg-success-soft"
    />
  );
}
