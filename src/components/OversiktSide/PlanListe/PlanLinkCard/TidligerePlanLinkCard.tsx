import { OppfolgingsplanMetadata } from "@/schema/oversiktResponseSchemas";
import PlanLinkCard from "./PlanLinkCard";
import PlanLinkCardDelingStatusFooterTags from "./PlanLinkCardFooterTags";

interface Props {
  tidligerePlan: OppfolgingsplanMetadata;
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
          isDeltMedNav={tidligerePlan.deltMedVeilederTidspunkt !== null}
          tagVariantHvisDelt="success-moderate"
          tagVariantHvisIkkeDelt="info-moderate"
        />
      }
      className="bg-ax-bg-neutral-soft"
    />
  );
}
