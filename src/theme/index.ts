import { Theme } from '../types';

export interface ThemeColors {
  bg: string;
  surface: string;
  surfaceAlt: string;
  accent: string;
  accentLight: string;
  text: string;
  textSecondary: string;
  textTertiary: string;
  border: string;
  inputBg: string;
  danger: string;
  divider: string;
}

export const darkColors: ThemeColors = {
  bg: '#0f0f11',
  surface: '#18181c',
  surfaceAlt: '#1e1e24',
  accent: '#7c6af7',
  accentLight: '#2d2540',
  text: '#f0eff4',
  textSecondary: '#a09cb0',
  textTertiary: '#6b6875',
  border: '#2a2a30',
  inputBg: '#1e1e24',
  danger: '#ef5350',
  divider: '#222228',
};

export const lightColors: ThemeColors = {
  bg: '#f5f4f0',
  surface: '#ffffff',
  surfaceAlt: '#f0eff4',
  accent: '#5b4fd9',
  accentLight: '#ede9ff',
  text: '#1a1a2e',
  textSecondary: '#6b6b85',
  textTertiary: '#9b9ab0',
  border: '#e0dfd8',
  inputBg: '#f0eff4',
  danger: '#e53935',
  divider: '#eae9e4',
};

export function getColors(theme: Theme): ThemeColors {
  return theme === 'dark' ? darkColors : lightColors;
}
