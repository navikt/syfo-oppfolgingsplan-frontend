import { OppfolgingsplanMetadata } from "@/schema/oppfolgingsplanerOversiktSchemas";
import PlanLinkCard from "./PlanLinkCard";
import PlanLinkCardShareStatusFooterTags from "./PlanLinkCardFooterTags";

interface Props {
  aktivPlan: OppfolgingsplanMetadata;
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
        <PlanLinkCardShareStatusFooterTags
          isDeltMedLege={aktivPlan.deltMedLegeTidspunkt !== null}
          isDeltMedNav={aktivPlan.deltMedVeilederTidspunkt !== null}
          sharedStatusTagVariant="success-moderate"
          notSharedStatusTagVariant="neutral-moderate"
        />
      }
      className="bg-ax-bg-success-soft"
    />
  );
}
