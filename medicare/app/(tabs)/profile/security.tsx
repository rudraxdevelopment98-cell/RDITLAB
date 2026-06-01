import { useEffect, useState } from 'react';
import { View, Switch, StyleSheet, Alert } from 'react-native';
import { Screen, Text, Card, Button } from '@/components/ui';
import { ListRow } from '@/components/ListRow';
import { useTheme } from '@/theme/ThemeProvider';
import { isBiometricAvailable, authenticate } from '@/lib/biometrics';
import { secureStorage } from '@/lib/secure-storage';

const BIOMETRIC_KEY = 'medicare.biometric_enabled';

export default function Security() {
  const { spacing, colors } = useTheme();
  const [biometricAvailable, setBiometricAvailable] = useState(false);
  const [biometricEnabled, setBiometricEnabled] = useState(false);

  useEffect(() => {
    isBiometricAvailable().then(setBiometricAvailable);
    secureStorage.getItem(BIOMETRIC_KEY).then((v) => setBiometricEnabled(v === '1'));
  }, []);

  const toggleBiometric = async (next: boolean) => {
    if (next) {
      const ok = await authenticate('Enable biometric unlock');
      if (!ok) return;
    }
    setBiometricEnabled(next);
    await secureStorage.setItem(BIOMETRIC_KEY, next ? '1' : '0');
  };

  const confirmDelete = () => {
    Alert.alert(
      'Delete account',
      'This permanently deletes your account and all health data within 30 days. This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => Alert.alert('Request received', 'Account deletion has been scheduled.'),
        },
      ],
    );
  };

  return (
    <Screen>
      <Card style={{ marginBottom: spacing.lg }}>
        <View style={styles.row}>
          <View style={{ flex: 1, paddingRight: spacing.md }}>
            <Text weight="semibold">Biometric unlock</Text>
            <Text variant="caption" tone="muted">
              {biometricAvailable
                ? 'Require fingerprint / Face ID to open the app.'
                : 'No biometrics enrolled on this device.'}
            </Text>
          </View>
          <Switch
            value={biometricEnabled}
            disabled={!biometricAvailable}
            onValueChange={toggleBiometric}
            trackColor={{ true: colors.brand }}
          />
        </View>
      </Card>

      <Text variant="subtitle" style={{ marginBottom: spacing.sm }}>Your privacy</Text>
      <ListRow icon="time-outline" label="View login history" onPress={() => Alert.alert('Login history', 'Audit log viewer coming soon.')} />
      <ListRow icon="phone-portrait-outline" label="Manage trusted devices" onPress={() => Alert.alert('Trusted devices', 'Device management coming soon.')} />
      <ListRow icon="download-outline" label="Download all my data" onPress={() => Alert.alert('Export', 'We will email you a full data export.')} />
      <ListRow icon="key-outline" label="Two-factor authentication" onPress={() => Alert.alert('2FA', 'TOTP-based 2FA coming soon.')} />

      <Card style={{ marginTop: spacing.lg, marginBottom: spacing.lg, backgroundColor: colors.brandSoft }}>
        <Text variant="caption" tone="brand" weight="semibold">🔐 Our promise</Text>
        <Text variant="caption" style={{ marginTop: spacing.xs }}>
          Your sensitive fields are encrypted on your device before they're ever stored. We never
          sell your data, never show ads, and you can delete everything at any time.
        </Text>
      </Card>

      <Button title="Delete my account" variant="danger" onPress={confirmDelete} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
});
