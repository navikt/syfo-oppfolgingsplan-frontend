export interface IkkeBesvartGodkjenningStatus {
  type: "IKKE_BESVART";
}

export interface GodkjentGodkjenningStatus {
  type: "GODKJENT";
}

export interface AvslattGodkjenningStatus {
  type: "AVSLATT";
  kommentar: string | null;
}

export interface OverstyrtGodkjenningStatus {
  type: "OVERSTYRT";
  begrunnelse: string;
}

export type GodkjenningStatus =
  | IkkeBesvartGodkjenningStatus
  | GodkjentGodkjenningStatus
  | AvslattGodkjenningStatus
  | OverstyrtGodkjenningStatus;
