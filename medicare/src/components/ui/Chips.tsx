import React from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';
import { Text } from './Text';

export type ChipOption<T extends string> = { label: string; value: T };

type Props<T extends string> = {
  options: ChipOption<T>[];
  value: T | T[] | null;
  onChange: (value: T) => void;
  multi?: boolean;
};

/** Horizontal selectable chips for single- or multi-select choices. */
export function Chips<T extends string>({ options, value, onChange, multi }: Props<T>) {
  const { colors, radius, spacing } = useTheme();

  const isSelected = (v: T) =>
    multi && Array.isArray(value) ? value.includes(v) : value === v;

  return (
    <View style={styles.wrap}>
      {options.map((opt) => {
        const selected = isSelected(opt.value);
        return (
          <Pressable
            key={opt.value}
            onPress={() => onChange(opt.value)}
            style={{
              backgroundColor: selected ? colors.brand : colors.surfaceAlt,
              borderRadius: radius.pill,
              paddingHorizontal: spacing.md,
              paddingVertical: spacing.sm,
            }}
          >
            <Text
              variant="caption"
              weight="medium"
              tone={selected ? 'inverse' : 'default'}
            >
              {opt.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
});
