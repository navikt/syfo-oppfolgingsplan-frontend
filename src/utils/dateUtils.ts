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
