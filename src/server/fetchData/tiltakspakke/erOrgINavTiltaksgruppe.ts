import "server-only";
import { finnOrganisasjonerITiltaksgruppe } from "./finnOrganisasjonerITiltaksgruppe";

export async function erOrgINavTiltaksgruppe(
  orgnummer: string,
): Promise<boolean> {
  return (await finnOrganisasjonerITiltaksgruppe([orgnummer])).has(orgnummer);
}
