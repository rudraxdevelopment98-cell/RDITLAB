import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import isToday from 'dayjs/plugin/isToday';

dayjs.extend(relativeTime);
dayjs.extend(isToday);

export { dayjs };

export function formatTime(value: string | Date): string {
  return dayjs(value).format('h:mm A');
}

export function formatDate(value: string | Date): string {
  return dayjs(value).format('DD MMM YYYY');
}

export function formatDateTime(value: string | Date): string {
  return dayjs(value).format('DD MMM, h:mm A');
}

export function fromNow(value: string | Date): string {
  return dayjs(value).fromNow();
}

export function isSameDay(a: string | Date, b: string | Date): boolean {
  return dayjs(a).isSame(b, 'day');
}

/** Age in whole years from a 'YYYY-MM-DD' date of birth. */
export function ageFromDob(dob: string | null): number | null {
  if (!dob) return null;
  const years = dayjs().diff(dayjs(dob), 'year');
  return Number.isFinite(years) ? years : null;
}
