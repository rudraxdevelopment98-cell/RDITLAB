import type { MedicationLog } from '@/types/models';
import { dayjs } from './date';

/**
 * Adherence = (taken doses) / (taken + missed + skipped doses) over a window.
 * Snoozed/pending entries are ignored as "not yet resolved".
 */
export function calculateAdherence(logs: MedicationLog[], days = 7): number {
  const cutoff = dayjs().subtract(days, 'day');
  const relevant = logs.filter((l) => dayjs(l.scheduledTime).isAfter(cutoff));

  const resolved = relevant.filter((l) =>
    ['taken', 'missed', 'skipped'].includes(l.status),
  );
  if (resolved.length === 0) return 100;

  const taken = resolved.filter((l) => l.status === 'taken').length;
  return Math.round((taken / resolved.length) * 100);
}

export function adherenceTone(percent: number): 'success' | 'warning' | 'danger' {
  if (percent >= 80) return 'success';
  if (percent >= 50) return 'warning';
  return 'danger';
}
