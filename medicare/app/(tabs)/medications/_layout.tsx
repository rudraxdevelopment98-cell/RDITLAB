import { Stack } from 'expo-router';
import { useTheme } from '@/theme/ThemeProvider';

export default function MedicationsLayout() {
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
      <Stack.Screen name="index" options={{ title: 'Medicines', headerShown: false }} />
      <Stack.Screen name="add" options={{ title: 'Add medicine', presentation: 'modal' }} />
    </Stack>
  );
}
