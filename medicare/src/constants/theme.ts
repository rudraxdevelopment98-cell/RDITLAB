/**
 * MediCare design tokens.
 *
 * A single source of truth for colors, spacing, typography and radii so the
 * whole app stays visually consistent and supports light / dark mode.
 */

const palette = {
  // Brand — calm medical teal/green ("Aarogya" health)
  teal900: '#0B5E4C',
  teal700: '#0E7C66',
  teal500: '#14A085',
  teal100: '#D4F1EA',

  // Accents
  blue500: '#2D6CDF',
  amber500: '#F5A623',
  red500: '#E5484D',
  green500: '#30A46C',

  white: '#FFFFFF',
  black: '#0A0A0A',

  gray50: '#F7F8FA',
  gray100: '#EEF0F4',
  gray200: '#E2E6EC',
  gray300: '#CBD2DC',
  gray400: '#9AA4B2',
  gray500: '#697586',
  gray600: '#4B5565',
  gray700: '#364152',
  gray800: '#202939',
  gray900: '#121926',
};

export type ColorScheme = {
  brand: string;
  brandDark: string;
  brandSoft: string;
  background: string;
  surface: string;
  surfaceAlt: string;
  border: string;
  text: string;
  textMuted: string;
  textInverse: string;
  accent: string;
  success: string;
  warning: string;
  danger: string;
  overlay: string;
};

export const lightColors: ColorScheme = {
  brand: palette.teal700,
  brandDark: palette.teal900,
  brandSoft: palette.teal100,
  background: palette.gray50,
  surface: palette.white,
  surfaceAlt: palette.gray100,
  border: palette.gray200,
  text: palette.gray900,
  textMuted: palette.gray500,
  textInverse: palette.white,
  accent: palette.blue500,
  success: palette.green500,
  warning: palette.amber500,
  danger: palette.red500,
  overlay: 'rgba(10, 10, 10, 0.45)',
};

export const darkColors: ColorScheme = {
  brand: palette.teal500,
  brandDark: palette.teal700,
  brandSoft: 'rgba(20, 160, 133, 0.16)',
  background: palette.gray900,
  surface: palette.gray800,
  surfaceAlt: palette.gray700,
  border: palette.gray700,
  text: palette.gray50,
  textMuted: palette.gray400,
  textInverse: palette.gray900,
  accent: '#6EA0FF',
  success: '#3DD68C',
  warning: '#FFC453',
  danger: '#FF6369',
  overlay: 'rgba(0, 0, 0, 0.6)',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
} as const;

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  pill: 999,
} as const;

export const fontSize = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 22,
  xxl: 28,
  xxxl: 34,
} as const;

export const fontWeight = {
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
} as const;

export { palette };
