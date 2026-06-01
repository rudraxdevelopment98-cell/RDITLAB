import { useState } from 'react';
import { View, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen, Text, Input, Button } from '@/components/ui';
import { useTheme } from '@/theme/ThemeProvider';
import { useAuthStore } from '@/store/auth.store';

export default function ForgotPassword() {
  const { spacing } = useTheme();
  const router = useRouter();
  const resetPassword = useAuthStore((s) => s.resetPassword);
  const loading = useAuthStore((s) => s.loading);
  const [email, setEmail] = useState('');

  const onSubmit = async () => {
    if (!email) {
      Alert.alert('Missing email', 'Enter the email linked to your account.');
      return;
    }
    try {
      await resetPassword(email.trim());
      Alert.alert('Email sent', 'Check your inbox for a reset link.');
      router.back();
    } catch (e: any) {
      Alert.alert('Could not send', e?.message ?? 'Please try again.');
    }
  };

  return (
    <Screen>
      <View style={{ marginTop: spacing.xxl, marginBottom: spacing.xl }}>
        <Text variant="title">Reset password</Text>
        <Text variant="body" tone="muted" style={{ marginTop: spacing.xs }}>
          We'll email you a secure link to set a new password.
        </Text>
      </View>

      <Input
        label="Email"
        placeholder="you@example.com"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />

      <Button title="Send reset link" onPress={onSubmit} loading={loading} />
      <Button title="Back to login" variant="ghost" onPress={() => router.back()} style={{ marginTop: spacing.md }} />
    </Screen>
  );
}
