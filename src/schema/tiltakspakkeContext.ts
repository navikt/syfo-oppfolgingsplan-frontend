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
  /** Tiltakspakke 2: dialogmøte info, gated by its own toggle. */
  isDialogmoteTiltakspakkeActive: boolean;
};
