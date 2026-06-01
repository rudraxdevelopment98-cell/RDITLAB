import { useState } from 'react';
import { View, Alert, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Screen, Text, Input, Button, Chips, type ChipOption } from '@/components/ui';
import { useTheme } from '@/theme/ThemeProvider';
import { useAuthStore } from '@/store/auth.store';
import { useHealthStore } from '@/store/health.store';
import type { MedicationForm, FoodInstruction, Weekday } from '@/types/models';
import { dayjs } from '@/utils/date';

const FORM_OPTIONS: ChipOption<MedicationForm>[] = [
  { label: 'Tablet', value: 'tablet' },
  { label: 'Capsule', value: 'capsule' },
  { label: 'Syrup', value: 'syrup' },
  { label: 'Injection', value: 'injection' },
  { label: 'Drops', value: 'drops' },
  { label: 'Inhaler', value: 'inhaler' },
  { label: 'Other', value: 'other' },
];

const INSTRUCTION_OPTIONS: ChipOption<FoodInstruction>[] = [
  { label: 'Before food', value: 'before_food' },
  { label: 'With food', value: 'with_food' },
  { label: 'After food', value: 'after_food' },
  { label: 'Empty stomach', value: 'empty_stomach' },
  { label: 'Anytime', value: 'anytime' },
];

const WEEKDAY_OPTIONS: ChipOption<Weekday>[] = [
  { label: 'Mon', value: 'MO' },
  { label: 'Tue', value: 'TU' },
  { label: 'Wed', value: 'WE' },
  { label: 'Thu', value: 'TH' },
  { label: 'Fri', value: 'FR' },
  { label: 'Sat', value: 'SA' },
  { label: 'Sun', value: 'SU' },
];

const TIME_RE = /^([01]\d|2[0-3]):[0-5]\d$/;

export default function AddMedication() {
  const { spacing, colors } = useTheme();
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const addMedication = useHealthStore((s) => s.addMedication);

  const [name, setName] = useState('');
  const [dosage, setDosage] = useState('');
  const [form, setForm] = useState<MedicationForm>('tablet');
  const [instruction, setInstruction] = useState<FoodInstruction>('after_food');
  const [times, setTimes] = useState<string[]>(['08:00']);
  const [days, setDays] = useState<Weekday[]>([]);
  const [stock, setStock] = useState('');
  const [refill, setRefill] = useState('');
  const [saving, setSaving] = useState(false);

  const addTime = () => setTimes((t) => [...t, '20:00']);
  const updateTime = (i: number, v: string) =>
    setTimes((t) => t.map((x, idx) => (idx === i ? v : x)));
  const removeTime = (i: number) => setTimes((t) => t.filter((_, idx) => idx !== i));

  const toggleDay = (d: Weekday) =>
    setDays((cur) => (cur.includes(d) ? cur.filter((x) => x !== d) : [...cur, d]));

  const onSave = async () => {
    if (!user) return;
    if (!name.trim() || !dosage.trim()) {
      Alert.alert('Missing info', 'Please enter the medicine name and dosage.');
      return;
    }
    const cleanTimes = times.filter((t) => TIME_RE.test(t));
    if (cleanTimes.length === 0) {
      Alert.alert('Invalid times', 'Add at least one valid time in HH:mm format (e.g. 08:00).');
      return;
    }

    setSaving(true);
    try {
      await addMedication(user.id, {
        conditionId: null,
        name: name.trim(),
        dosage: dosage.trim(),
        form,
        instruction,
        startDate: dayjs().format('YYYY-MM-DD'),
        endDate: null,
        stockCount: stock ? parseInt(stock, 10) : null,
        refillThreshold: refill ? parseInt(refill, 10) : null,
        schedules: cleanTimes.map((time) => ({
          time,
          daysOfWeek: days.length > 0 ? days : null,
        })),
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
      <Input label="Medicine name" placeholder="e.g. Metformin" value={name} onChangeText={setName} />
      <Input label="Dosage" placeholder="e.g. 500 mg" value={dosage} onChangeText={setDosage} />

      <Text variant="caption" tone="muted" weight="medium" style={{ marginBottom: spacing.sm }}>Form</Text>
      <View style={{ marginBottom: spacing.lg }}>
        <Chips options={FORM_OPTIONS} value={form} onChange={setForm} />
      </View>

      <Text variant="caption" tone="muted" weight="medium" style={{ marginBottom: spacing.sm }}>When to take</Text>
      <View style={{ marginBottom: spacing.lg }}>
        <Chips options={INSTRUCTION_OPTIONS} value={instruction} onChange={setInstruction} />
      </View>

      <Text variant="caption" tone="muted" weight="medium" style={{ marginBottom: spacing.sm }}>
        Times (24h, HH:mm)
      </Text>
      {times.map((t, i) => (
        <View key={i} style={styles.timeRow}>
          <View style={{ flex: 1 }}>
            <Input placeholder="08:00" value={t} onChangeText={(v) => updateTime(i, v)} keyboardType="numbers-and-punctuation" />
          </View>
          {times.length > 1 ? (
            <Pressable onPress={() => removeTime(i)} style={{ paddingBottom: spacing.lg, paddingLeft: spacing.md }}>
              <Ionicons name="close-circle" size={24} color={colors.textMuted} />
            </Pressable>
          ) : null}
        </View>
      ))}
      <Button title="+ Add another time" variant="ghost" size="sm" onPress={addTime} style={{ marginBottom: spacing.lg }} />

      <Text variant="caption" tone="muted" weight="medium" style={{ marginBottom: spacing.sm }}>
        Repeat on (leave empty for every day)
      </Text>
      <View style={{ marginBottom: spacing.lg }}>
        <Chips options={WEEKDAY_OPTIONS} value={days} onChange={toggleDay} multi />
      </View>

      <View style={styles.row}>
        <View style={{ flex: 1, marginRight: spacing.sm }}>
          <Input label="Stock (pills)" placeholder="30" value={stock} onChangeText={setStock} keyboardType="number-pad" />
        </View>
        <View style={{ flex: 1, marginLeft: spacing.sm }}>
          <Input label="Refill at" placeholder="5" value={refill} onChangeText={setRefill} keyboardType="number-pad" />
        </View>
      </View>

      <Button title="Save medicine" onPress={onSave} loading={saving} />
      <View style={{ height: spacing.xxl }} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row' },
  timeRow: { flexDirection: 'row', alignItems: 'center' },
});
