import { useCallback, useEffect, useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Screen, Text, Card, Badge, Button } from '@/components/ui';
import { useTheme } from '@/theme/ThemeProvider';
import { useAuthStore } from '@/store/auth.store';
import { useHealthStore } from '@/store/health.store';
import { buildTodaysDoses } from '@/utils/schedule';
import { calculateAdherence, adherenceTone } from '@/utils/adherence';
import { formatTime, formatDateTime, dayjs } from '@/utils/date';

export default function Dashboard() {
  const { colors, spacing } = useTheme();
  const router = useRouter();
  const user = useAuthStore((s) => s.user);

  const { medications, logs, vitals, appointments, loading, loadAll, logDose } = useHealthStore();

  useEffect(() => {
    if (user) loadAll(user.id);
  }, [user, loadAll]);

  const doses = useMemo(() => buildTodaysDoses(medications, logs), [medications, logs]);
  const adherence = useMemo(() => calculateAdherence(logs, 7), [logs]);
  const taken = doses.filter((d) => d.status === 'taken').length;

  const nextAppointment = useMemo(
    () =>
      appointments
        .filter((a) => a.status === 'upcoming' && dayjs(a.scheduledAt).isAfter(dayjs()))
        .sort((a, b) => a.scheduledAt.localeCompare(b.scheduledAt))[0],
    [appointments],
  );

  const latestVital = vitals[0];
  const greeting = greetingForNow();

  const onRefresh = useCallback(() => {
    if (user) loadAll(user.id);
  }, [user, loadAll]);

  const markTaken = (d: (typeof doses)[number]) => {
    if (!user) return;
    logDose(user.id, d.medication.id, d.scheduledAt, 'taken', d.scheduleId);
  };

  return (
    <Screen refreshing={loading} onRefresh={onRefresh}>
      <Text variant="caption" tone="muted">{greeting}</Text>
      <Text variant="title" style={{ marginBottom: spacing.lg }}>
        {user?.user_metadata?.full_name ?? 'Welcome'} 👋
      </Text>

      {/* Adherence summary */}
      <Card style={{ marginBottom: spacing.lg, backgroundColor: colors.brand }}>
        <Text variant="caption" tone="inverse">7-day adherence</Text>
        <View style={styles.row}>
          <Text variant="display" tone="inverse">{adherence}%</Text>
          <View style={{ alignItems: 'flex-end' }}>
            <Text variant="caption" tone="inverse">Today</Text>
            <Text variant="subtitle" tone="inverse">{taken}/{doses.length} doses</Text>
          </View>
        </View>
      </Card>

      {/* Today's medications */}
      <View style={[styles.row, { marginBottom: spacing.sm }]}>
        <Text variant="subtitle">Today's medicines</Text>
        <Button title="Add" size="sm" variant="ghost" fullWidth={false} onPress={() => router.push('/(tabs)/medications/add')} />
      </View>

      {doses.length === 0 ? (
        <Card style={{ marginBottom: spacing.lg }}>
          <Text tone="muted">No medicines scheduled for today. Tap "Add" to set one up.</Text>
        </Card>
      ) : (
        doses.map((d) => (
          <Card key={d.key} style={{ marginBottom: spacing.sm }}>
            <View style={styles.row}>
              <View style={{ flex: 1 }}>
                <Text weight="semibold">{d.medication.name}</Text>
                <Text variant="caption" tone="muted">
                  {d.medication.dosage} · {formatTime(d.scheduledAt)}
                </Text>
              </View>
              {d.status === 'taken' ? (
                <Badge label="Taken ✓" tone="success" />
              ) : d.status === 'missed' ? (
                <Button title="Take" size="sm" fullWidth={false} onPress={() => markTaken(d)} />
              ) : (
                <Button title="Take" size="sm" variant="secondary" fullWidth={false} onPress={() => markTaken(d)} />
              )}
            </View>
          </Card>
        ))
      )}

      {/* Next appointment */}
      <Text variant="subtitle" style={{ marginTop: spacing.lg, marginBottom: spacing.sm }}>
        Next appointment
      </Text>
      {nextAppointment ? (
        <Card onPress={() => router.push('/(tabs)/appointments')}>
          <View style={styles.row}>
            <View style={{ flex: 1 }}>
              <Text weight="semibold">{nextAppointment.doctorName}</Text>
              <Text variant="caption" tone="muted">
                {nextAppointment.specialty ?? 'Consultation'} · {formatDateTime(nextAppointment.scheduledAt)}
              </Text>
            </View>
            <Ionicons name="chevron-forward" color={colors.textMuted} size={20} />
          </View>
        </Card>
      ) : (
        <Card>
          <Text tone="muted">No upcoming appointments.</Text>
        </Card>
      )}

      {/* Latest vital */}
      {latestVital ? (
        <>
          <Text variant="subtitle" style={{ marginTop: spacing.lg, marginBottom: spacing.sm }}>
            Latest reading
          </Text>
          <Card onPress={() => router.push('/(tabs)/vitals')}>
            <Text weight="semibold">
              {labelForVital(latestVital.type)}: {latestVital.value1}
              {latestVital.value2 ? `/${latestVital.value2}` : ''} {latestVital.unit}
            </Text>
            <Text variant="caption" tone="muted">{formatDateTime(latestVital.recordedAt)}</Text>
          </Card>
        </>
      ) : null}

      <View style={{ height: spacing.xxl }} />
    </Screen>
  );
}

function greetingForNow(): string {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

function labelForVital(type: string): string {
  const map: Record<string, string> = {
    blood_sugar: 'Blood sugar',
    blood_pressure: 'Blood pressure',
    weight: 'Weight',
    temperature: 'Temperature',
    heart_rate: 'Heart rate',
    spo2: 'SpO₂',
  };
  return map[type] ?? type;
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
});
