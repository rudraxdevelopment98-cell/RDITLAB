import { Stack } from 'expo-router';
import { useTheme } from '@/theme/ThemeProvider';

export default function VitalsLayout() {
  const { colors } = useTheme();
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: colors.background },
        headerTintColor: colors.text,
        headerShadowVisible: false,
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="add" options={{ title: 'Add reading', presentation: 'modal' }} />
    </Stack>
  );
}
