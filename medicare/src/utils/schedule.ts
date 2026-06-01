import type { Medication, MedicationLog, Weekday } from '@/types/models';
import { dayjs } from './date';

export type DoseSlot = {
  key: string;
  medication: Medication;
  scheduleId: string;
  time: string; // 'HH:mm'
  scheduledAt: string; // ISO for today
  status: MedicationLog['status'];
};

const NUM_TO_WEEKDAY: Weekday[] = ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'];

/**
 * Expand each medication's schedules into the concrete doses due *today*,
 * matched against existing logs to know which are taken/missed/pending.
 */
export function buildTodaysDoses(
  medications: Medication[],
  logs: MedicationLog[],
): DoseSlot[] {
  const today = dayjs();
  const todayWeekday = NUM_TO_WEEKDAY[today.day()];
  const slots: DoseSlot[] = [];

  for (const med of medications) {
    if (!med.isActive) continue;
    if (med.endDate && dayjs(med.endDate).isBefore(today, 'day')) continue;
    if (dayjs(med.startDate).isAfter(today, 'day')) continue;

    for (const schedule of med.schedules ?? []) {
      const days = schedule.daysOfWeek;
      if (days && days.length > 0 && !days.includes(todayWeekday)) continue;

      const [h, m] = schedule.time.split(':').map((n) => parseInt(n, 10));
      const scheduledAt = today.hour(h).minute(m).second(0).millisecond(0);

      const log = logs.find(
        (l) =>
          l.medicationId === med.id &&
          dayjs(l.scheduledTime).isSame(scheduledAt, 'minute'),
      );

      let status: MedicationLog['status'] = log?.status ?? 'pending';
      if (status === 'pending' && scheduledAt.isBefore(today.subtract(1, 'hour'))) {
        status = 'missed';
      }

      slots.push({
        key: `${med.id}:${schedule.id}:${schedule.time}`,
        medication: med,
        scheduleId: schedule.id,
        time: schedule.time,
        scheduledAt: scheduledAt.toISOString(),
        status,
      });
    }
  }

  return slots.sort((a, b) => a.time.localeCompare(b.time));
}
