import { fetchDecoratorReact } from "@navikt/nav-dekoratoren-moduler/ssr";
import { publicEnv } from "@/env-variables/publicEnv";

export async function fetchDecoratorForAG(
  narmesteLederId: string,
  sykmeldtNavn: string
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
        sykmeldtNavn,
        narmesteLederId
      ),
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
  sykmeldtNavn: string,
  narmesteLederId: string
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
      title: sykmeldtNavn,
    },
    {
      url: `${publicEnv.NEXT_PUBLIC_BASE_PATH}/${narmesteLederId}`,
      title: "Oppfølgingsplan",
    },
  ];
}
