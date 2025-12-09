import { Dayjs } from "dayjs";
import dayjs from "./app-dayjs";

export function now(): Dayjs {
  return dayjs().tz();
}

export function getDayjsFromDate(date: Date): Dayjs {
  return dayjs(date).tz();
}

export function getDayjsFromIsoString(isoDateString: string): Dayjs {
  return dayjs(isoDateString).tz();
}

export function getTomorrowDayDate(): Date {
  const tomorrow = now().add(1, "day").startOf("day");
  return tomorrow.toDate();
}

export function getOneYearFromNowDayDate(): Date {
  const oneYearFromNow = now().add(1, "year").startOf("day");
  return oneYearFromNow.toDate();
}

export function isDateToday(isoDateString: string): boolean {
  const d = getDayjsFromIsoString(isoDateString);
  return d.isToday();
}

export function isNotMoreThanOneHourAgo(isoDateString: string): boolean {
  const d = getDayjsFromIsoString(isoDateString);
  return now().diff(d, "hour") < 1;
}

export function isTomorrowOrLater(isoDateString: string): boolean {
  const d = getDayjsFromIsoString(isoDateString);
  const tomorrow = getTomorrowDayDate();

  return d.isSameOrAfter(tomorrow, "day");
}

export function isLessThanOneYearAway(isoDateString: string): boolean {
  const d = getDayjsFromIsoString(isoDateString);
  const oneYearFromNow = getOneYearFromNowDayDate();

  return d.isBefore(oneYearFromNow, "day");
}

export function toDateStringInIsoFormat(date: Date): string {
  const dayjsDate = getDayjsFromDate(date);
  return dayjsDate.format("YYYY-MM-DD");
}
