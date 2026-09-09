import { z } from "zod";

/** Assignment for one organisation; unknown is never treated as control. */
export const tildelingsgruppeSchema = z.enum([
  "tiltak",
  "kontroll",
  "utenfor_scope",
  "ukjent",
]);
export type Tildelingsgruppe = z.infer<typeof tildelingsgruppeSchema>;

export type TiltakspakkeContext = {
  gruppe: Tildelingsgruppe;
  /** Delivery also depends on the feature toggle, independently of assignment. */
  erITiltaksgruppe: boolean;
};
