import React from 'react';
import { Text as RNText, type TextProps, StyleSheet } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';

type Variant = 'display' | 'title' | 'heading' | 'subtitle' | 'body' | 'caption' | 'label';
type Tone = 'default' | 'muted' | 'brand' | 'inverse' | 'danger' | 'success';

type Props = TextProps & {
  variant?: Variant;
  tone?: Tone;
  weight?: 'regular' | 'medium' | 'semibold' | 'bold';
  center?: boolean;
};

export function Text({
  variant = 'body',
  tone = 'default',
  weight,
  center,
  style,
  ...rest
}: Props) {
  const { colors, fontSize, fontWeight } = useTheme();

  const variantStyle = {
    display: { fontSize: fontSize.xxxl, fontWeight: fontWeight.bold },
    title: { fontSize: fontSize.xxl, fontWeight: fontWeight.bold },
    heading: { fontSize: fontSize.xl, fontWeight: fontWeight.semibold },
    subtitle: { fontSize: fontSize.lg, fontWeight: fontWeight.semibold },
    body: { fontSize: fontSize.md, fontWeight: fontWeight.regular },
    caption: { fontSize: fontSize.sm, fontWeight: fontWeight.regular },
    label: { fontSize: fontSize.xs, fontWeight: fontWeight.medium },
  }[variant];

  const toneColor = {
    default: colors.text,
    muted: colors.textMuted,
    brand: colors.brand,
    inverse: colors.textInverse,
    danger: colors.danger,
    success: colors.success,
  }[tone];

  return (
    <RNText
      style={[
        variantStyle,
        { color: toneColor },
        weight ? { fontWeight: fontWeight[weight] } : null,
        center ? styles.center : null,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  center: { textAlign: 'center' },
});
