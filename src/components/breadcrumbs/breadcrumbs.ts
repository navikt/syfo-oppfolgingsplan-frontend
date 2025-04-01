import { publicEnv } from "@/constants/envs";

export function createBreadcrumbsAG(
  sykmeldtName: string,
  narmestelederid: string,
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
      url: `${publicEnv.NEXT_PUBLIC_DINE_SYKMELDTE_URL}/${narmestelederid}`,
      title: sykmeldtName,
    },
    {
      url: `${publicEnv.NEXT_PUBLIC_BASE_PATH}/arbeidsgiver/${narmestelederid}`,
      title: "Oppfølgingsplan",
    },
  ];
}
