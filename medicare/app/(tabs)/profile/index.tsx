import { useEffect, useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen, Text, Card, Button } from '@/components/ui';
import { ListRow } from '@/components/ListRow';
import { useTheme } from '@/theme/ThemeProvider';
import { useAuthStore } from '@/store/auth.store';
import { profileService } from '@/services/profile.service';
import type { Profile } from '@/types/models';
import { ageFromDob } from '@/utils/date';

export default function ProfileScreen() {
  const { spacing, colors } = useTheme();
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const signOut = useAuthStore((s) => s.signOut);
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    if (user) profileService.get(user.id).then(setProfile).catch(() => {});
  }, [user]);

  const name = profile?.fullName ?? user?.user_metadata?.full_name ?? 'Your profile';
  const age = ageFromDob(profile?.dateOfBirth ?? null);

  const onSignOut = () => {
    Alert.alert('Log out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Log out', style: 'destructive', onPress: () => signOut() },
    ]);
  };

  return (
    <Screen>
      <Text variant="title" style={{ marginBottom: spacing.lg }}>Profile</Text>

      <Card style={{ marginBottom: spacing.xl }}>
        <View style={styles.header}>
          <View style={[styles.avatar, { backgroundColor: colors.brandSoft }]}>
            <Text variant="title" tone="brand">{initials(name)}</Text>
          </View>
          <View style={{ marginLeft: spacing.lg, flex: 1 }}>
            <Text variant="subtitle">{name}</Text>
            <Text variant="caption" tone="muted">{user?.email}</Text>
            {age != null || profile?.bloodGroup ? (
              <Text variant="caption" tone="muted">
                {age != null ? `${age} yrs` : ''}{age != null && profile?.bloodGroup ? ' · ' : ''}
                {profile?.bloodGroup ?? ''}
              </Text>
            ) : null}
          </View>
        </View>
      </Card>

      <ListRow icon="medical-outline" label="Health conditions" onPress={() => router.push('/(tabs)/profile/conditions')} />
      <ListRow icon="settings-outline" label="Settings" onPress={() => router.push('/(tabs)/profile/settings')} />
      <ListRow icon="shield-checkmark-outline" label="Security & privacy" onPress={() => router.push('/(tabs)/profile/security')} />
      <ListRow icon="document-text-outline" label="Reports & export" onPress={() => Alert.alert('Coming soon', 'PDF/CSV reports arrive in the next phase.')} />
      <ListRow icon="help-circle-outline" label="Help & support" onPress={() => Alert.alert('Support', 'Email: support@medicare.app')} />

      <View style={{ marginTop: spacing.xl }}>
        <Button title="Log out" variant="ghost" onPress={onSignOut} />
      </View>

      <Text variant="caption" tone="muted" center style={{ marginTop: spacing.xl }}>
        MediCare v1.0.0 · Built privacy-first 🔐
      </Text>
    </Screen>
  );
}

function initials(name: string): string {
  return name
    .split(' ')
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center' },
  avatar: { width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center' },
});
