import { View } from 'react-native';
import { Screen, Text, Card, Chips, type ChipOption } from '@/components/ui';
import { useTheme, type ThemePreference } from '@/theme/ThemeProvider';

const THEME_OPTIONS: ChipOption<ThemePreference>[] = [
  { label: 'System', value: 'system' },
  { label: 'Light', value: 'light' },
  { label: 'Dark', value: 'dark' },
];

const LANG_OPTIONS: ChipOption<'en' | 'hi' | 'gu'>[] = [
  { label: 'English', value: 'en' },
  { label: 'हिन्दी', value: 'hi' },
  { label: 'ગુજરાતી', value: 'gu' },
];

export default function Settings() {
  const { spacing, preference, setPreference } = useTheme();

  return (
    <Screen>
      <Card style={{ marginBottom: spacing.lg }}>
        <Text variant="subtitle" style={{ marginBottom: spacing.md }}>Appearance</Text>
        <Chips options={THEME_OPTIONS} value={preference} onChange={setPreference} />
      </Card>

      <Card style={{ marginBottom: spacing.lg }}>
        <Text variant="subtitle" style={{ marginBottom: spacing.md }}>Language</Text>
        <Chips options={LANG_OPTIONS} value={'en'} onChange={() => {}} />
        <Text variant="caption" tone="muted" style={{ marginTop: spacing.sm }}>
          Full Hindi & Gujarati translations arrive in a later phase.
        </Text>
      </Card>

      <Card>
        <Text variant="subtitle" style={{ marginBottom: spacing.md }}>Notifications</Text>
        <View>
          <Text>Quiet hours: 10 PM – 6 AM</Text>
          <Text variant="caption" tone="muted">Non-critical reminders are paused while you sleep.</Text>
        </View>
      </Card>
    </Screen>
  );
}
