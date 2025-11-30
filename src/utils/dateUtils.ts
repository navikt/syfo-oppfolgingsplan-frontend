export function getTomorrowDate(): Date {
  const today = new Date();
  const tomorrow = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate() + 1,
  );
  return tomorrow;
}

export function getOneYearFromNowDate(): Date {
  const today = new Date();
  const oneYearFromNow = new Date(
    today.getFullYear() + 1,
    today.getMonth(),
    today.getDate(),
  );
  return oneYearFromNow;
}

export function isDateInPast(date: Date): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date < today;
}

/**
 * Given the date value from the onChange handler on the date picker form
 * component, this returns a ISO date string (`YYYY-MM-DD`) that represents the
 * date that was picked.
 *
 * If the date 2025-11-27 is picked, a Date object representing midnight
 * at the start of that day in the local time zone is created. This instant
 * in time may correspond to a differen date in UTC depending on the local
 * time zone, so if using .toISOString() on the Date object, it may yield:
 *
 * - `2025-11-26T23:00:00Z` (11 PM UTC on November 26, 2025)
 *
 * But when using getFullYear(), getMonth(), and getDate() on the Date object,
 * the local date components are extracted, resulting in the date that was picked,
 * formatted in ISO format, like `2025-11-27`.
 *
 */
export function toLocalDateStringInIsoFormat(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`; // "YYYY-MM-DD"
}

export function isValidDate(date: Date): boolean {
  return !isNaN(date.getTime());
}
