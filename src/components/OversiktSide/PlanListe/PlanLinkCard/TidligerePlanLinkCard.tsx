import { OppfolgingsplanMetadata } from "@/schema/oppfolgingsplanerOversiktSchemas";
import PlanLinkCard from "./PlanLinkCard";
import PlanLinkCardShareStatusFooterTags from "./PlanLinkCardFooterTags";

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
        <PlanLinkCardShareStatusFooterTags
          isDeltMedLege={tidligerePlan.deltMedLegeTidspunkt !== null}
          isDeltMedNav={tidligerePlan.deltMedVeilederTidspunkt !== null}
          sharedStatusTagVariant="success-moderate"
          notSharedStatusTagVariant="info-moderate"
        />
      }
      className="bg-ax-bg-neutral-soft"
    />
  );
}
