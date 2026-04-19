import AsyncStorage from '@react-native-async-storage/async-storage';

export type ThemeType = 'light' | 'dark';

export interface Theme {
  colors: {
    primary: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
    border: string;
    error: string;
    success: string;
  };
}

export const lightTheme: Theme = {
  colors: {
    primary: '#1e40af',
    background: '#f9fafb',
    surface: '#ffffff',
    text: '#1f2937',
    textSecondary: '#6b7280',
    border: '#e5e7eb',
    error: '#ef4444',
    success: '#10b981',
  },
};

export const darkTheme: Theme = {
  colors: {
    primary: '#3b82f6',
    background: '#111827',
    surface: '#1f2937',
    text: '#f3f4f6',
    textSecondary: '#d1d5db',
    border: '#374151',
    error: '#f87171',
    success: '#34d399',
  },
};

const THEME_STORAGE_KEY = 'app_theme';

export const getTheme = async (): Promise<ThemeType> => {
  try {
    const stored = await AsyncStorage.getItem(THEME_STORAGE_KEY);
    return (stored as ThemeType) || 'light';
  } catch (error) {
    console.error('Error getting theme:', error);
    return 'light';
  }
};

export const setTheme = async (theme: ThemeType) => {
  try {
    await AsyncStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch (error) {
    console.error('Error setting theme:', error);
  }
};

export const getThemeObject = (theme: ThemeType): Theme => {
  return theme === 'dark' ? darkTheme : lightTheme;
};
