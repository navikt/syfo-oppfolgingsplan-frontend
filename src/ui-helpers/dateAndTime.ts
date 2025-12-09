const LOCALE = "nb-NO";
const DONT_SHOW_YEAR_IF_CURRENT_YEAR = true;

export function getLocaleDateAndTimeString(
  dateTime: Date,
  dateFormat: "long" | "short",
) {
  return `${getLocaleDateString(dateTime, dateFormat)} kl. ${dateTime.toLocaleTimeString(
    LOCALE,
    {
      timeZone: "Europe/Oslo",
      hour: "2-digit",
      minute: "2-digit",
    },
  )}`;
}

export function getLocaleDateString(date: Date, format: "long" | "short") {
  const currentYear = new Date().getFullYear();
  const dateIsCurrentYear = date.getFullYear() === currentYear;

  const dateOptions: Intl.DateTimeFormatOptions = {
    timeZone: "Europe/Oslo",
    year:
      DONT_SHOW_YEAR_IF_CURRENT_YEAR && dateIsCurrentYear
        ? undefined
        : format === "long"
          ? "numeric"
          : "2-digit",
    month: format === "long" ? "long" : "2-digit",
    day: format === "long" ? "numeric" : "2-digit",
  };

  return date.toLocaleDateString(LOCALE, dateOptions);
}
