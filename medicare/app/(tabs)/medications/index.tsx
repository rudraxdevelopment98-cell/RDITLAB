import { useCallback, useEffect } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Screen, Text, Card, Badge, Button, EmptyState } from '@/components/ui';
import { useTheme } from '@/theme/ThemeProvider';
import { useAuthStore } from '@/store/auth.store';
import { useHealthStore } from '@/store/health.store';
import type { Medication } from '@/types/models';

export default function MedicationsList() {
  const { spacing, colors } = useTheme();
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const { medications, loading, loadAll, removeMedication } = useHealthStore();

  useEffect(() => {
    if (user && medications.length === 0) loadAll(user.id);
  }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

  const onRefresh = useCallback(() => {
    if (user) loadAll(user.id);
  }, [user, loadAll]);

  const confirmDelete = (med: Medication) => {
    Alert.alert('Remove medicine', `Stop tracking "${med.name}"?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Remove', style: 'destructive', onPress: () => removeMedication(med.id) },
    ]);
  };

  return (
    <Screen refreshing={loading} onRefresh={onRefresh}>
      <View style={[styles.row, { marginBottom: spacing.lg }]}>
        <Text variant="title">Medicines</Text>
        <Button
          title="+ Add"
          size="sm"
          fullWidth={false}
          onPress={() => router.push('/(tabs)/medications/add')}
        />
      </View>

      {medications.length === 0 ? (
        <EmptyState
          emoji="💊"
          title="No medicines yet"
          message="Add your medicines and we'll remind you at the right time — even offline."
          actionLabel="Add your first medicine"
          onAction={() => router.push('/(tabs)/medications/add')}
        />
      ) : (
        medications.map((med) => (
          <Card key={med.id} style={{ marginBottom: spacing.md }}>
            <View style={styles.row}>
              <View style={{ flex: 1 }}>
                <Text variant="subtitle">{med.name}</Text>
                <Text variant="caption" tone="muted">
                  {med.dosage} · {med.form} · {instructionLabel(med.instruction)}
                </Text>
                <View style={[styles.tags, { marginTop: spacing.sm }]}>
                  {(med.schedules ?? []).map((s) => (
                    <Badge key={s.id} label={s.time} tone="brand" />
                  ))}
                  {med.stockCount != null &&
                  med.refillThreshold != null &&
                  med.stockCount <= med.refillThreshold ? (
                    <Badge label={`Refill: ${med.stockCount} left`} tone="warning" />
                  ) : null}
                </View>
              </View>
              <Ionicons
                name="trash-outline"
                size={20}
                color={colors.textMuted}
                onPress={() => confirmDelete(med)}
              />
            </View>
          </Card>
        ))
      )}
    </Screen>
  );
}

function instructionLabel(instruction: Medication['instruction']): string {
  return instruction.replace('_', ' ');
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
});
