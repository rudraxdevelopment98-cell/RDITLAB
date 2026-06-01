import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';
import { Text } from './Text';
import { Button } from './Button';

type Props = {
  emoji?: string;
  title: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
};

export function EmptyState({ emoji = '🗂️', title, message, actionLabel, onAction }: Props) {
  const { spacing } = useTheme();
  return (
    <View style={[styles.container, { padding: spacing.xl }]}>
      <Text variant="display" center style={{ marginBottom: spacing.md }}>
        {emoji}
      </Text>
      <Text variant="subtitle" center style={{ marginBottom: spacing.xs }}>
        {title}
      </Text>
      {message ? (
        <Text variant="body" tone="muted" center style={{ marginBottom: spacing.lg }}>
          {message}
        </Text>
      ) : null}
      {actionLabel && onAction ? (
        <Button title={actionLabel} onPress={onAction} fullWidth={false} />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', justifyContent: 'center', flex: 1 },
});
