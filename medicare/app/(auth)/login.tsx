import { useState } from 'react';
import { View, Alert } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { Screen, Text, Input, Button } from '@/components/ui';
import { useTheme } from '@/theme/ThemeProvider';
import { useAuthStore } from '@/store/auth.store';
import { isSupabaseConfigured } from '@/lib/supabase';

export default function Login() {
  const { spacing } = useTheme();
  const router = useRouter();
  const signIn = useAuthStore((s) => s.signIn);
  const loading = useAuthStore((s) => s.loading);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onSubmit = async () => {
    if (!email || !password) {
      Alert.alert('Missing details', 'Please enter your email and password.');
      return;
    }
    if (!isSupabaseConfigured) {
      Alert.alert('Backend not configured', 'Set your Supabase keys in .env to enable login.');
      return;
    }
    try {
      await signIn(email.trim(), password);
      router.replace('/(tabs)');
    } catch (e: any) {
      Alert.alert('Login failed', e?.message ?? 'Please try again.');
    }
  };

  return (
    <Screen>
      <View style={{ marginTop: spacing.xxxl, marginBottom: spacing.xl }}>
        <Text variant="display" tone="brand">MediCare</Text>
        <Text variant="body" tone="muted" style={{ marginTop: spacing.xs }}>
          Your health, on time. Privately.
        </Text>
      </View>

      <Text variant="title" style={{ marginBottom: spacing.lg }}>Welcome back</Text>

      <Input
        label="Email"
        placeholder="you@example.com"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      <Input
        label="Password"
        placeholder="••••••••"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <Link href="/(auth)/forgot-password" style={{ marginBottom: spacing.lg }}>
        <Text variant="caption" tone="brand" weight="medium">Forgot password?</Text>
      </Link>

      <Button title="Log in" onPress={onSubmit} loading={loading} />

      <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: spacing.xl }}>
        <Text tone="muted">Don't have an account? </Text>
        <Link href="/(auth)/signup">
          <Text tone="brand" weight="semibold">Sign up</Text>
        </Link>
      </View>
    </Screen>
  );
}
