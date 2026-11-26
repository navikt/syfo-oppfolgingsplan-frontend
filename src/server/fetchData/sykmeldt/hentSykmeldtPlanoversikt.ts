import "server-only";
import { fetchOppfolgingsplanOversiktForSM } from "./fetchOppfolgingsplanOversiktForSM";
import { lagSykmeldtPlanoversikt } from "./lagSykmeldtPlanoversikt";

export async function hentSykmeldtPlanoversikt() {
  return lagSykmeldtPlanoversikt(await fetchOppfolgingsplanOversiktForSM());
}
