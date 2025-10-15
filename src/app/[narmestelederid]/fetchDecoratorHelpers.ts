import { publicEnv } from "@/env-variables/publicEnv";
import { fetchDecoratorReact } from "@navikt/nav-dekoratoren-moduler/ssr";

export async function fetchDecorator(
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
      chatbotVisible: true,
      feedback: false,
      redirectToApp: true,
      breadcrumbs: createBreadcrumbsForAG(sykmeldtNavn, narmesteLederId),
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

function createBreadcrumbsForAG(sykmeldtNavn: string, narmesteLederId: string) {
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
