import { useState } from 'react';
import { View, Alert } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { Screen, Text, Input, Button } from '@/components/ui';
import { useTheme } from '@/theme/ThemeProvider';
import { useAuthStore } from '@/store/auth.store';
import { isSupabaseConfigured } from '@/lib/supabase';

export default function Signup() {
  const { spacing } = useTheme();
  const router = useRouter();
  const signUp = useAuthStore((s) => s.signUp);
  const loading = useAuthStore((s) => s.loading);

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onSubmit = async () => {
    if (!fullName || !email || !password) {
      Alert.alert('Missing details', 'Please fill in all fields.');
      return;
    }
    if (password.length < 8) {
      Alert.alert('Weak password', 'Use at least 8 characters.');
      return;
    }
    if (!isSupabaseConfigured) {
      Alert.alert('Backend not configured', 'Set your Supabase keys in .env to enable sign up.');
      return;
    }
    try {
      await signUp(email.trim(), password, fullName.trim());
      Alert.alert(
        'Check your inbox',
        'We sent a verification link to your email. Verify, then log in.',
      );
      router.replace('/(auth)/login');
    } catch (e: any) {
      Alert.alert('Sign up failed', e?.message ?? 'Please try again.');
    }
  };

  return (
    <Screen>
      <View style={{ marginTop: spacing.xxl, marginBottom: spacing.xl }}>
        <Text variant="title">Create your account</Text>
        <Text variant="body" tone="muted" style={{ marginTop: spacing.xs }}>
          Encrypted by design. We never sell your data.
        </Text>
      </View>

      <Input label="Full name" placeholder="Kuldip Jotaniya" value={fullName} onChangeText={setFullName} />
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
        placeholder="At least 8 characters"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        hint="Use a strong, unique password."
      />

      <Button title="Create account" onPress={onSubmit} loading={loading} />

      <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: spacing.xl }}>
        <Text tone="muted">Already have an account? </Text>
        <Link href="/(auth)/login">
          <Text tone="brand" weight="semibold">Log in</Text>
        </Link>
      </View>
    </Screen>
  );
}
