import { LumiSurveyDock } from "@navikt/lumi-survey/client";
import { publicEnv } from "@/env-variables/publicEnv";
import { unntakSurvey } from "./unntakSurvey";

// The routes contain identifiers, so the survey sends fixed tags instead of
// collecting the location.
export function UnntakLumiSurvey() {
  return (
    <LumiSurveyDock
      surveyId="oppfolgingsplan-sykmeldt-unntak"
      survey={unntakSurvey}
      transport={{
        endpoint: `${publicEnv.NEXT_PUBLIC_BASE_PATH}/api/lumi/feedback`,
      }}
      context={{
        tags: { app: "syfo-oppfolgingsplan-frontend", rolle: "sykmeldt" },
      }}
    />
  );
}
