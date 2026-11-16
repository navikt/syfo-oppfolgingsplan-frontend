import "server-only";
import { OPPFOLGINGSPLAN_TILTAKSPAKKE_1 } from "@/schema/flaggskipetSchemas";
import { hentTildelingsgrupper } from "./hentTildelingsgrupper";

export async function finnOrganisasjonerITiltaksgruppe(
  orgnumre: Iterable<string>,
): Promise<ReadonlySet<string>> {
  const tildelinger = await hentTildelingsgrupper(orgnumre, [
    OPPFOLGINGSPLAN_TILTAKSPAKKE_1,
  ]);
  return new Set(
    [...(tildelinger.get(OPPFOLGINGSPLAN_TILTAKSPAKKE_1) ?? [])]
      .filter(([, gruppe]) => gruppe === "tiltak")
      .map(([orgnummer]) => orgnummer),
  );
}
