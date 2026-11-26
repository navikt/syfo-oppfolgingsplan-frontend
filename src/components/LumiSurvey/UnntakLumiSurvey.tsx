import { LumiSurveyDock } from "@navikt/lumi-survey/client";
import { publicEnv } from "@/env-variables/publicEnv";
import { unntakSurvey } from "./unntakSurvey";

export function UnntakLumiSurvey() {
  return (
    <LumiSurveyDock
      surveyId="sykmeldt-unntak-fra-oppfolgingsplanen"
      survey={unntakSurvey}
      transport={{
        endpoint: `${publicEnv.NEXT_PUBLIC_BASE_PATH}/api/lumi/feedback`,
      }}
    />
  );
}
