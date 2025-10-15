export function getPlanDatoHeading(opprettetDato: Date) {
  if (!(opprettetDato instanceof Date) || isNaN(opprettetDato.getTime())) {
    console.error("Invalid date provided to getPlanDatoHeading");
    return "Ugyldig dato";
  }
  return opprettetDato.toLocaleDateString("nb-NO", {
    month: "long",
    day: "numeric",
  });
}

// <BodyShort size="small" spacing>
// <strong>Opprettet:</strong>{" "}
export function getDatoStringWithTime(dato: Date) {
  if (!(dato instanceof Date) || isNaN(dato.getTime())) {
    console.error("Invalid date provided to getDatoString");
    return "Ugyldig dato";
  }
  return `${dato.toLocaleDateString("nb-NO", {
    month: "long",
    day: "numeric",
  })} kl. ${dato.toLocaleTimeString("nb-NO", {
    hour: "2-digit",
    minute: "2-digit",
  })}`;
}

export function getDatoString(dato: Date) {
  if (!(dato instanceof Date) || isNaN(dato.getTime())) {
    console.error("Invalid date provided to getDatoString");
    return "Ugyldig dato";
  }
  return `${dato.toLocaleDateString("nb-NO", {
    month: "long",
    day: "numeric",
    year: "numeric",
  })}`;
}

export function getShortDatoString(dato: Date) {
  if (!(dato instanceof Date) || isNaN(dato.getTime())) {
    console.error("Invalid date provided to getShortDatoString");
    return "Ugyldig dato";
  }
  return `${dato.toLocaleDateString("nb-NO", {
    month: "2-digit",
    day: "2-digit",
    year: "2-digit",
  })}`;
}
