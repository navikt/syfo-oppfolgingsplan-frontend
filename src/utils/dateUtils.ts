export function getFutureDate(months: number): Date {
  const date = new Date();
  date.setMonth(date.getMonth() + months);
  return date;
}

export function getPastDate(months: number): Date {
  const date = new Date();
  date.setMonth(date.getMonth() - months);
  return date;
}

export function getTomorrowDate(): Date {
  const today = new Date();
  const tomorrow = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate() + 1
  );
  return tomorrow;
}

export function getOneYearFromNowDate(): Date {
  const today = new Date();
  const oneYearFromNow = new Date(
    today.getFullYear() + 1,
    today.getMonth(),
    today.getDate()
  );
  return oneYearFromNow;
}
