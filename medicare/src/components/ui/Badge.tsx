import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';
import { Text } from './Text';

type Tone = 'neutral' | 'brand' | 'success' | 'warning' | 'danger';

export function Badge({ label, tone = 'neutral' }: { label: string; tone?: Tone }) {
  const { colors, radius, spacing } = useTheme();

  const map = {
    neutral: { bg: colors.surfaceAlt, fg: colors.textMuted },
    brand: { bg: colors.brandSoft, fg: colors.brand },
    success: { bg: 'rgba(48,163,108,0.15)', fg: colors.success },
    warning: { bg: 'rgba(245,166,35,0.18)', fg: colors.warning },
    danger: { bg: 'rgba(229,72,77,0.15)', fg: colors.danger },
  }[tone];

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: map.bg,
          borderRadius: radius.pill,
          paddingHorizontal: spacing.sm,
          paddingVertical: 2,
        },
      ]}
    >
      <Text variant="label" weight="semibold" style={{ color: map.fg }}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: { alignSelf: 'flex-start' },
});
