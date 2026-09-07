import { hentTiltakspakkeContext } from "./hentTiltakspakkeContext";

export async function erNarmesteLederINavTiltaksgruppe(
  narmesteLederId: string,
): Promise<boolean> {
  return (await hentTiltakspakkeContext(narmesteLederId)).erITiltaksgruppe;
}
