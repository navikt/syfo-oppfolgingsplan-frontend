import { OppfolgingsplanDataForOversikt } from "@/schema/oppfolgingsplanOversiktSchema";
import PlanLinkPanel from "./PlanLinkPanel/PlanLinkPanel";

interface Props {
  aktivPlan: OppfolgingsplanDataForOversikt;
}

export default function AktivPlanLinkPanel({ aktivPlan }: Props) {
  return (
    <PlanLinkPanel
      className="bg-ax-bg-success-soft"
      arbeidsplassNavn="Arbeidsplassen AS"
      href={`TODO/${aktivPlan.uuid}`}
      opprettetDato={new Date(aktivPlan.createdAt)}
      evalueringsDato={new Date(aktivPlan.evalueringsdato)}
      isDeltMedLege={aktivPlan.deltMedLegeTidspunkt !== null}
      isDeltMedNav={aktivPlan.deltMedVeilederTidspunkt !== null}
    />
  );
}
