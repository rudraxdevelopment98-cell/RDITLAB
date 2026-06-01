import { useCallback, useEffect, useMemo, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen, Text, Card, Button, Chips, EmptyState, type ChipOption } from '@/components/ui';
import { useTheme } from '@/theme/ThemeProvider';
import { useAuthStore } from '@/store/auth.store';
import { useHealthStore } from '@/store/health.store';
import type { Vital, VitalType } from '@/types/models';
import { formatDateTime } from '@/utils/date';

const FILTERS: ChipOption<VitalType | 'all'>[] = [
  { label: 'All', value: 'all' },
  { label: 'Sugar', value: 'blood_sugar' },
  { label: 'BP', value: 'blood_pressure' },
  { label: 'Weight', value: 'weight' },
  { label: 'Temp', value: 'temperature' },
];

const VITAL_LABEL: Record<VitalType, string> = {
  blood_sugar: 'Blood sugar',
  blood_pressure: 'Blood pressure',
  weight: 'Weight',
  temperature: 'Temperature',
  heart_rate: 'Heart rate',
  spo2: 'SpO₂',
};

export default function VitalsList() {
  const { spacing } = useTheme();
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const { vitals, loading, loadAll } = useHealthStore();
  const [filter, setFilter] = useState<VitalType | 'all'>('all');

  useEffect(() => {
    if (user && vitals.length === 0) loadAll(user.id);
  }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

  const onRefresh = useCallback(() => {
    if (user) loadAll(user.id);
  }, [user, loadAll]);

  const filtered = useMemo(
    () => (filter === 'all' ? vitals : vitals.filter((v) => v.type === filter)),
    [vitals, filter],
  );

  return (
    <Screen refreshing={loading} onRefresh={onRefresh}>
      <View style={[styles.row, { marginBottom: spacing.lg }]}>
        <Text variant="title">Vitals</Text>
        <Button title="+ Add" size="sm" fullWidth={false} onPress={() => router.push('/(tabs)/vitals/add')} />
      </View>

      <View style={{ marginBottom: spacing.lg }}>
        <Chips options={FILTERS} value={filter} onChange={setFilter} />
      </View>

      {filtered.length === 0 ? (
        <EmptyState
          emoji="📈"
          title="No readings yet"
          message="Log your sugar, BP, weight and more to see trends over time."
          actionLabel="Add a reading"
          onAction={() => router.push('/(tabs)/vitals/add')}
        />
      ) : (
        filtered.map((v) => <VitalRow key={v.id} vital={v} />)
      )}
    </Screen>
  );
}

function VitalRow({ vital }: { vital: Vital }) {
  const { spacing } = useTheme();
  const display = vital.value2 ? `${vital.value1}/${vital.value2}` : `${vital.value1}`;
  return (
    <Card style={{ marginBottom: spacing.sm }}>
      <View style={styles.row}>
        <View>
          <Text weight="semibold">{VITAL_LABEL[vital.type]}</Text>
          <Text variant="caption" tone="muted">
            {formatDateTime(vital.recordedAt)}
            {vital.context ? ` · ${vital.context.replace('_', ' ')}` : ''}
          </Text>
        </View>
        <Text variant="heading" tone="brand">
          {display} <Text variant="caption" tone="muted">{vital.unit}</Text>
        </Text>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
});
