import "server-only";
import { hentTildelingsgrupper } from "./hentTildelingsgrupper";

export async function finnOrganisasjonerITiltaksgruppe(
  orgnumre: Iterable<string>,
): Promise<ReadonlySet<string>> {
  const tildelinger = await hentTildelingsgrupper(orgnumre);
  return new Set(
    [...tildelinger]
      .filter(([, gruppe]) => gruppe === "tiltak")
      .map(([orgnummer]) => orgnummer),
  );
}
