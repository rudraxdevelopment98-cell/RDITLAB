/**
 * Local notification scheduling for MediCare.
 *
 * Local notifications power offline reminders (medications, water, vitals,
 * appointments). Server-side push (Expo -> FCM/APNs) is layered on top later
 * via Supabase Edge Functions; this module only handles the on-device piece.
 */
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import type { Medication, Weekday } from '@/types/models';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    // `shouldShowAlert` is the legacy flag; `shouldShowBanner`/`shouldShowList`
    // are the SDK 52+ replacements. Setting all keeps both API versions happy.
    shouldShowAlert: true,
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const WEEKDAY_TO_NUMBER: Record<Weekday, number> = {
  // expo-notifications weekday: 1 = Sunday ... 7 = Saturday
  SU: 1, MO: 2, TU: 3, WE: 4, TH: 5, FR: 6, SA: 7,
};

export async function requestNotificationPermission(): Promise<boolean> {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('medications', {
      name: 'Medication reminders',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#0E7C66',
    });
  }
  const settings = await Notifications.getPermissionsAsync();
  if (settings.granted) return true;
  const req = await Notifications.requestPermissionsAsync();
  return req.granted;
}

/** Quiet hours: suppress non-critical reminders between 22:00 and 06:00. */
export function isWithinQuietHours(date = new Date()): boolean {
  const h = date.getHours();
  return h >= 22 || h < 6;
}

/**
 * Schedule recurring local notifications for one medication based on its
 * schedules. Returns the created notification identifiers so callers can
 * cancel them when the medication changes.
 */
export async function scheduleMedicationReminders(
  medication: Medication,
): Promise<string[]> {
  const ids: string[] = [];
  const schedules = medication.schedules ?? [];

  for (const schedule of schedules) {
    const [hour, minute] = schedule.time.split(':').map((n) => parseInt(n, 10));
    const days = schedule.daysOfWeek ?? null;

    const body = `${medication.name} ${medication.dosage} · ${formatInstruction(medication)}`;

    if (!days || days.length === 0) {
      const id = await Notifications.scheduleNotificationAsync({
        content: { title: 'Time for your medicine 💊', body },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DAILY,
          hour,
          minute,
          channelId: 'medications',
        },
      });
      ids.push(id);
    } else {
      for (const day of days) {
        const id = await Notifications.scheduleNotificationAsync({
          content: { title: 'Time for your medicine 💊', body },
          trigger: {
            type: Notifications.SchedulableTriggerInputTypes.WEEKLY,
            weekday: WEEKDAY_TO_NUMBER[day],
            hour,
            minute,
            channelId: 'medications',
          },
        });
        ids.push(id);
      }
    }
  }
  return ids;
}

export async function cancelReminders(ids: string[]): Promise<void> {
  await Promise.all(ids.map((id) => Notifications.cancelScheduledNotificationAsync(id)));
}

export async function cancelAllReminders(): Promise<void> {
  await Notifications.cancelAllScheduledNotificationsAsync();
}

function formatInstruction(med: Medication): string {
  switch (med.instruction) {
    case 'before_food': return 'before food';
    case 'after_food': return 'after food';
    case 'with_food': return 'with food';
    case 'empty_stomach': return 'empty stomach';
    default: return 'anytime';
  }
}
