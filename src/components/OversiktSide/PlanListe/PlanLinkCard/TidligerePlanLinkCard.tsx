import { FerdigstiltPlanMetadata } from "@/schema/ferdigstiltPlanMetadataSchema";
import PlanLinkCard from "./PlanLinkCard";
import PlanLinkCardDelingStatusFooterTags from "./PlanLinkCardFooterTags";

interface Props {
  tidligerePlan: FerdigstiltPlanMetadata;
  arbeidsstedNavn: string;
  href: string;
}

export default function TidligerePlanLinkCard({
  tidligerePlan,
  arbeidsstedNavn,
  href,
}: Props) {
  return (
    <PlanLinkCard
      href={href}
      planMetadata={tidligerePlan}
      arbeidsstedNavn={arbeidsstedNavn}
      footerContent={
        <PlanLinkCardDelingStatusFooterTags
          isDeltMedLege={tidligerePlan.deltMedLegeTidspunkt !== null}
          isDeltMedVeileder={tidligerePlan.deltMedVeilederTidspunkt !== null}
          tagVariantHvisDelt="success-moderate"
          tagVariantHvisIkkeDelt="info-moderate"
          tagSize="small"
        />
      }
      className="bg-ax-bg-neutral-soft"
    />
  );
}
