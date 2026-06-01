/**
 * Theme context — exposes the active color scheme plus design tokens, and lets
 * the user override the system light/dark preference (Settings screen).
 */
import React, { createContext, useContext, useMemo, useState, useCallback } from 'react';
import { useColorScheme } from 'react-native';
import {
  lightColors,
  darkColors,
  spacing,
  radius,
  fontSize,
  fontWeight,
  type ColorScheme,
} from '@/constants/theme';

export type ThemePreference = 'system' | 'light' | 'dark';

type ThemeValue = {
  colors: ColorScheme;
  isDark: boolean;
  preference: ThemePreference;
  setPreference: (p: ThemePreference) => void;
  spacing: typeof spacing;
  radius: typeof radius;
  fontSize: typeof fontSize;
  fontWeight: typeof fontWeight;
};

const ThemeContext = createContext<ThemeValue | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const system = useColorScheme();
  const [preference, setPreference] = useState<ThemePreference>('system');

  const isDark =
    preference === 'system' ? system === 'dark' : preference === 'dark';

  const handleSetPreference = useCallback((p: ThemePreference) => {
    setPreference(p);
  }, []);

  const value = useMemo<ThemeValue>(
    () => ({
      colors: isDark ? darkColors : lightColors,
      isDark,
      preference,
      setPreference: handleSetPreference,
      spacing,
      radius,
      fontSize,
      fontWeight,
    }),
    [isDark, preference, handleSetPreference],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within a ThemeProvider');
  return ctx;
}
