import { useEffect, useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Screen, Text, Card, Input, Button, Badge, Chips, EmptyState, type ChipOption } from '@/components/ui';
import { useTheme } from '@/theme/ThemeProvider';
import { useAuthStore } from '@/store/auth.store';
import { useHealthStore } from '@/store/health.store';
import type { ConditionSeverity } from '@/types/models';
import { conditionsService } from '@/services/conditions.service';
import { formatDate } from '@/utils/date';

const SEVERITY: ChipOption<ConditionSeverity>[] = [
  { label: 'Mild', value: 'mild' },
  { label: 'Moderate', value: 'moderate' },
  { label: 'Severe', value: 'severe' },
];

export default function Conditions() {
  const { spacing } = useTheme();
  const user = useAuthStore((s) => s.user);
  const { conditions, loadAll, addCondition } = useHealthStore();

  const [name, setName] = useState('');
  const [severity, setSeverity] = useState<ConditionSeverity>('moderate');
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    if (user && conditions.length === 0) loadAll(user.id);
  }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

  const onAdd = async () => {
    if (!user || !name.trim()) {
      Alert.alert('Missing info', 'Enter a condition name.');
      return;
    }
    setAdding(true);
    try {
      await addCondition(user.id, {
        name: name.trim(),
        severity,
        diagnosedDate: null,
        notes: null,
      });
      setName('');
    } catch (e: any) {
      Alert.alert('Could not add', e?.message ?? 'Please try again.');
    } finally {
      setAdding(false);
    }
  };

  const onRemove = (id: string) => {
    Alert.alert('Remove condition', 'Remove this condition?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Remove',
        style: 'destructive',
        onPress: async () => {
          await conditionsService.remove(id);
          if (user) loadAll(user.id);
        },
      },
    ]);
  };

  return (
    <Screen>
      <Card style={{ marginBottom: spacing.xl }}>
        <Text variant="subtitle" style={{ marginBottom: spacing.md }}>Add a condition</Text>
        <Input placeholder="e.g. Type 2 Diabetes" value={name} onChangeText={setName} />
        <Text variant="caption" tone="muted" weight="medium" style={{ marginBottom: spacing.sm }}>Severity</Text>
        <View style={{ marginBottom: spacing.lg }}>
          <Chips options={SEVERITY} value={severity} onChange={setSeverity} />
        </View>
        <Button title="Add condition" onPress={onAdd} loading={adding} />
      </Card>

      {conditions.length === 0 ? (
        <EmptyState emoji="🏥" title="No conditions added" message="Add chronic conditions to tailor your reminders." />
      ) : (
        conditions.map((c) => (
          <Card key={c.id} style={{ marginBottom: spacing.sm }} onPress={() => onRemove(c.id)}>
            <View style={styles.row}>
              <View style={{ flex: 1 }}>
                <Text weight="semibold">{c.name}</Text>
                {c.diagnosedDate ? (
                  <Text variant="caption" tone="muted">Since {formatDate(c.diagnosedDate)}</Text>
                ) : null}
              </View>
              {c.severity ? (
                <Badge
                  label={c.severity}
                  tone={c.severity === 'severe' ? 'danger' : c.severity === 'moderate' ? 'warning' : 'success'}
                />
              ) : null}
            </View>
          </Card>
        ))
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
});
