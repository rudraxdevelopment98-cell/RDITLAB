import { useMemo, useState } from 'react';
import { View, Alert, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen, Text, Input, Button, Chips, type ChipOption } from '@/components/ui';
import { useTheme } from '@/theme/ThemeProvider';
import { useAuthStore } from '@/store/auth.store';
import { useHealthStore } from '@/store/health.store';
import type { VitalType, VitalContext } from '@/types/models';

const TYPE_OPTIONS: ChipOption<VitalType>[] = [
  { label: 'Blood sugar', value: 'blood_sugar' },
  { label: 'Blood pressure', value: 'blood_pressure' },
  { label: 'Weight', value: 'weight' },
  { label: 'Temperature', value: 'temperature' },
  { label: 'Heart rate', value: 'heart_rate' },
  { label: 'SpO₂', value: 'spo2' },
];

const CONTEXT_OPTIONS: ChipOption<NonNullable<VitalContext>>[] = [
  { label: 'Fasting', value: 'fasting' },
  { label: 'Pre-meal', value: 'pre_meal' },
  { label: 'Post-meal', value: 'post_meal' },
  { label: 'Random', value: 'random' },
];

const DEFAULT_UNIT: Record<VitalType, string> = {
  blood_sugar: 'mg/dL',
  blood_pressure: 'mmHg',
  weight: 'kg',
  temperature: '°F',
  heart_rate: 'bpm',
  spo2: '%',
};

export default function AddVital() {
  const { spacing } = useTheme();
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const addVital = useHealthStore((s) => s.addVital);

  const [type, setType] = useState<VitalType>('blood_sugar');
  const [value1, setValue1] = useState('');
  const [value2, setValue2] = useState('');
  const [context, setContext] = useState<NonNullable<VitalContext>>('fasting');
  const [saving, setSaving] = useState(false);

  const isBP = type === 'blood_pressure';
  const showContext = type === 'blood_sugar';
  const unit = useMemo(() => DEFAULT_UNIT[type], [type]);

  const onSave = async () => {
    if (!user) return;
    const v1 = parseFloat(value1);
    if (Number.isNaN(v1)) {
      Alert.alert('Invalid value', 'Please enter a valid number.');
      return;
    }
    const v2 = isBP ? parseFloat(value2) : NaN;
    if (isBP && Number.isNaN(v2)) {
      Alert.alert('Invalid value', 'Enter both systolic and diastolic for blood pressure.');
      return;
    }

    setSaving(true);
    try {
      await addVital(user.id, {
        type,
        value1: v1,
        value2: isBP ? v2 : null,
        unit,
        context: showContext ? context : null,
        notes: null,
        recordedAt: new Date().toISOString(),
      });
      router.back();
    } catch (e: any) {
      Alert.alert('Could not save', e?.message ?? 'Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Screen>
      <Text variant="caption" tone="muted" weight="medium" style={{ marginBottom: spacing.sm }}>Type</Text>
      <View style={{ marginBottom: spacing.lg }}>
        <Chips options={TYPE_OPTIONS} value={type} onChange={setType} />
      </View>

      {isBP ? (
        <View style={styles.row}>
          <View style={{ flex: 1, marginRight: spacing.sm }}>
            <Input label={`Systolic (${unit})`} placeholder="120" value={value1} onChangeText={setValue1} keyboardType="numeric" />
          </View>
          <View style={{ flex: 1, marginLeft: spacing.sm }}>
            <Input label={`Diastolic (${unit})`} placeholder="80" value={value2} onChangeText={setValue2} keyboardType="numeric" />
          </View>
        </View>
      ) : (
        <Input label={`Value (${unit})`} placeholder="e.g. 110" value={value1} onChangeText={setValue1} keyboardType="numeric" />
      )}

      {showContext ? (
        <>
          <Text variant="caption" tone="muted" weight="medium" style={{ marginBottom: spacing.sm }}>Context</Text>
          <View style={{ marginBottom: spacing.lg }}>
            <Chips options={CONTEXT_OPTIONS} value={context} onChange={setContext} />
          </View>
        </>
      ) : null}

      <Button title="Save reading" onPress={onSave} loading={saving} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row' },
});
