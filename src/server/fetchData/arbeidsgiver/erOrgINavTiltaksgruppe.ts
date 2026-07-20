import "server-only";
import { OPPFOLGINGSPLAN_TILTAKSPAKKE_1 } from "@/schema/flaggskipetSchemas";
import {
  fetchTiltakspakkeVurdering,
  ORGNUMMER_REGEX,
} from "./fetchTiltakspakkeVurdering";

export async function erOrgINavTiltaksgruppe(
  orgnummer: string,
): Promise<boolean> {
  if (!ORGNUMMER_REGEX.test(orgnummer)) {
    return false;
  }

  const result = await fetchTiltakspakkeVurdering(orgnummer);

  if (result.error) {
    return false;
  }

  const tiltakspakke = result.data.find(
    (vurdering) => vurdering.tiltakspakkeId === OPPFOLGINGSPLAN_TILTAKSPAKKE_1,
  );
  const virksomhet = tiltakspakke?.virksomheter.find(
    (it) => it.orgnummer === orgnummer,
  );

  return virksomhet?.deltakelse === "TILTAKSGRUPPE";
}
