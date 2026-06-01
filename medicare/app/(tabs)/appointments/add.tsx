import { useState } from 'react';
import { Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen, Input, Button, Text } from '@/components/ui';
import { useTheme } from '@/theme/ThemeProvider';
import { useAuthStore } from '@/store/auth.store';
import { useHealthStore } from '@/store/health.store';
import { dayjs } from '@/utils/date';

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const TIME_RE = /^([01]\d|2[0-3]):[0-5]\d$/;

export default function AddAppointment() {
  const { spacing } = useTheme();
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const addAppointment = useHealthStore((s) => s.addAppointment);

  const [doctorName, setDoctorName] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState(dayjs().add(1, 'day').format('YYYY-MM-DD'));
  const [time, setTime] = useState('17:00');
  const [purpose, setPurpose] = useState('');
  const [saving, setSaving] = useState(false);

  const onSave = async () => {
    if (!user) return;
    if (!doctorName.trim()) {
      Alert.alert('Missing info', 'Please enter the doctor name.');
      return;
    }
    if (!DATE_RE.test(date) || !TIME_RE.test(time)) {
      Alert.alert('Invalid date/time', 'Use YYYY-MM-DD and HH:mm formats.');
      return;
    }
    const scheduledAt = dayjs(`${date}T${time}`).toISOString();

    setSaving(true);
    try {
      await addAppointment(user.id, {
        doctorName: doctorName.trim(),
        specialty: specialty.trim() || null,
        location: location.trim() || null,
        phone: null,
        scheduledAt,
        purpose: purpose.trim() || null,
        notesBefore: null,
        notesAfter: null,
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
      <Input label="Doctor name" placeholder="Dr. Sharma" value={doctorName} onChangeText={setDoctorName} />
      <Input label="Specialty" placeholder="Cardiologist" value={specialty} onChangeText={setSpecialty} />
      <Input label="Location" placeholder="City Hospital, Ahmedabad" value={location} onChangeText={setLocation} />
      <Input label="Date (YYYY-MM-DD)" placeholder="2026-06-15" value={date} onChangeText={setDate} keyboardType="numbers-and-punctuation" />
      <Input label="Time (HH:mm)" placeholder="17:00" value={time} onChangeText={setTime} keyboardType="numbers-and-punctuation" />
      <Input label="Purpose" placeholder="Routine check-up" value={purpose} onChangeText={setPurpose} />

      <Text variant="caption" tone="muted" style={{ marginBottom: spacing.lg }}>
        You'll be reminded 1 day and 1 hour before.
      </Text>

      <Button title="Save appointment" onPress={onSave} loading={saving} />
    </Screen>
  );
}
