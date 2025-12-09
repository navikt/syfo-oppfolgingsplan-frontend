import { DATE_HIDE_YEAR_IF_THIS_YEAR } from "@/common/app-config";
import { getDayjsFromIsoString, now } from "@/utils/dateAndTime/dateUtils";

export function getFormattedDateAndTimeString(
  dateIsoString: string,
  displaySeconds = false,
) {
  const dateString = getFormattedDateString(dateIsoString);
  const timeString = getFormattedTimeString(dateIsoString, displaySeconds);

  return `${dateString} kl. ${timeString}`;
}

export function getFormattedTimeString(
  dateIsoString: string,
  displaySeconds = false,
) {
  const d = getDayjsFromIsoString(dateIsoString);
  return d.format(displaySeconds ? "HH:mm:ss" : "HH:mm");
}

export function getFormattedDateString(dateIsoString: string) {
  const d = getDayjsFromIsoString(dateIsoString);
  const isThisYear = d.isSame(now(), "year");

  return d.format(
    isThisYear && DATE_HIDE_YEAR_IF_THIS_YEAR ? "D. MMMM" : "D. MMMM YYYY",
  );
}
