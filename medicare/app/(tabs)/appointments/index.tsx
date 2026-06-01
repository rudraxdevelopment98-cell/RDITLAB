import { useCallback, useEffect, useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen, Text, Card, Badge, Button, EmptyState } from '@/components/ui';
import { useTheme } from '@/theme/ThemeProvider';
import { useAuthStore } from '@/store/auth.store';
import { useHealthStore } from '@/store/health.store';
import type { Appointment } from '@/types/models';
import { formatDateTime, dayjs } from '@/utils/date';

export default function AppointmentsList() {
  const { spacing } = useTheme();
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const { appointments, loading, loadAll } = useHealthStore();

  useEffect(() => {
    if (user && appointments.length === 0) loadAll(user.id);
  }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

  const onRefresh = useCallback(() => {
    if (user) loadAll(user.id);
  }, [user, loadAll]);

  const { upcoming, past } = useMemo(() => {
    const now = dayjs();
    const up: Appointment[] = [];
    const pa: Appointment[] = [];
    for (const a of appointments) {
      if (a.status === 'upcoming' && dayjs(a.scheduledAt).isAfter(now)) up.push(a);
      else pa.push(a);
    }
    return { upcoming: up, past: pa };
  }, [appointments]);

  return (
    <Screen refreshing={loading} onRefresh={onRefresh}>
      <View style={[styles.row, { marginBottom: spacing.lg }]}>
        <Text variant="title">Appointments</Text>
        <Button title="+ Add" size="sm" fullWidth={false} onPress={() => router.push('/(tabs)/appointments/add')} />
      </View>

      {appointments.length === 0 ? (
        <EmptyState
          emoji="📅"
          title="No appointments"
          message="Add doctor visits and we'll remind you 1 day and 1 hour before."
          actionLabel="Add appointment"
          onAction={() => router.push('/(tabs)/appointments/add')}
        />
      ) : (
        <>
          {upcoming.length > 0 ? (
            <>
              <Text variant="subtitle" style={{ marginBottom: spacing.sm }}>Upcoming</Text>
              {upcoming.map((a) => <AppointmentRow key={a.id} appt={a} />)}
            </>
          ) : null}
          {past.length > 0 ? (
            <>
              <Text variant="subtitle" style={{ marginTop: spacing.lg, marginBottom: spacing.sm }}>Past</Text>
              {past.map((a) => <AppointmentRow key={a.id} appt={a} />)}
            </>
          ) : null}
        </>
      )}
    </Screen>
  );
}

function AppointmentRow({ appt }: { appt: Appointment }) {
  const { spacing } = useTheme();
  const tone =
    appt.status === 'completed' ? 'success' : appt.status === 'cancelled' ? 'danger' : 'brand';
  return (
    <Card style={{ marginBottom: spacing.sm }}>
      <View style={styles.row}>
        <View style={{ flex: 1 }}>
          <Text weight="semibold">{appt.doctorName}</Text>
          <Text variant="caption" tone="muted">
            {appt.specialty ?? 'Consultation'} · {formatDateTime(appt.scheduledAt)}
          </Text>
          {appt.location ? (
            <Text variant="caption" tone="muted">📍 {appt.location}</Text>
          ) : null}
        </View>
        <Badge label={appt.status} tone={tone} />
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
});
