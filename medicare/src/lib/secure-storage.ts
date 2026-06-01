/**
 * Cross-platform secure key/value storage.
 *
 * - Native (iOS/Android): expo-secure-store (Keychain / Keystore backed).
 * - Web: falls back to localStorage (dev/preview only — not for real secrets).
 *
 * Used for the Supabase session and any short-lived sensitive tokens.
 */
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const webStore: Record<string, string> = {};

function isWeb() {
  return Platform.OS === 'web';
}

export const secureStorage = {
  async getItem(key: string): Promise<string | null> {
    if (isWeb()) {
      if (typeof localStorage !== 'undefined') return localStorage.getItem(key);
      return webStore[key] ?? null;
    }
    return SecureStore.getItemAsync(key);
  },

  async setItem(key: string, value: string): Promise<void> {
    if (isWeb()) {
      if (typeof localStorage !== 'undefined') localStorage.setItem(key, value);
      else webStore[key] = value;
      return;
    }
    await SecureStore.setItemAsync(key, value);
  },

  async removeItem(key: string): Promise<void> {
    if (isWeb()) {
      if (typeof localStorage !== 'undefined') localStorage.removeItem(key);
      else delete webStore[key];
      return;
    }
    await SecureStore.deleteItemAsync(key);
  },
};
