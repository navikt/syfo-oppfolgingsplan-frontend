import "server-only";
import { OPPFOLGINGSPLAN_TILTAKSPAKKE_1 } from "@/schema/flaggskipetSchemas";
import { hentTildelingsgrupper } from "./hentTildelingsgrupper";

export async function finnOrganisasjonerITiltaksgruppe(
  orgnumre: Iterable<string>,
): Promise<ReadonlySet<string>> {
  const tildelinger = await hentTildelingsgrupper(orgnumre);
  return new Set(
    [...tildelinger[OPPFOLGINGSPLAN_TILTAKSPAKKE_1]]
      .filter(([, gruppe]) => gruppe === "tiltak")
      .map(([orgnummer]) => orgnummer),
  );
}
