import { fetchDecoratorReact } from "@navikt/nav-dekoratoren-moduler/ssr";
import { getBaseBreadcrumbsForSM } from "@/common/breadcrumbs";
import { publicEnv } from "@/env-variables/publicEnv";

export async function fetchDecoratorForAG(
  narmesteLederId: string,
  employeeName: string,
) {
  return await fetchDecoratorReact({
    env: createDecoratorEnv(),
    params: {
      language: "nb",
      context: "arbeidsgiver",
      logoutWarning: true,
      chatbot: true,
      chatbotVisible: false,
      feedback: false,
      redirectToApp: true,
      breadcrumbs: createDecoratorBreadcrumbsForAG(
        employeeName,
        narmesteLederId,
      ),
    },
  });
}

export async function fetchDecoratorForSM() {
  return await fetchDecoratorReact({
    env: createDecoratorEnv(),
    params: {
      language: "nb",
      context: "privatperson",
      logoutWarning: true,
      chatbot: true,
      chatbotVisible: false,
      feedback: false,
      redirectToApp: true,
      breadcrumbs: getBaseBreadcrumbsForSM(),
    },
  });
}

function createDecoratorEnv(): "dev" | "prod" {
  switch (publicEnv.NEXT_PUBLIC_RUNTIME_ENVIRONMENT) {
    case "local":
    case "test":
    case "dev":
      return "dev";
    default:
      return "prod";
  }
}

function createDecoratorBreadcrumbsForAG(
  employeeName: string,
  narmesteLederId: string,
) {
  return [
    {
      url: publicEnv.NEXT_PUBLIC_MIN_SIDE_ARBEIDSGIVER_URL,
      title: "Min side arbeidsgiver",
    },
    {
      url: publicEnv.NEXT_PUBLIC_DINE_SYKMELDTE_URL,
      title: "Dine sykmeldte",
    },
    {
      url: `${publicEnv.NEXT_PUBLIC_DINE_SYKMELDTE_URL}/${narmesteLederId}`,
      title: employeeName,
    },
    {
      url: `${publicEnv.NEXT_PUBLIC_BASE_PATH}/${narmesteLederId}`,
      title: "Oppfølgingsplaner",
    },
  ];
}
