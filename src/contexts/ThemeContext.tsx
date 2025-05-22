import React, { createContext, useContext, useState, ReactNode, useMemo } from 'react';
import { Theme, ThemeOptions, createTheme } from '@mui/material';

// Define theme types
export type ThemeMode = 'light' | 'dark';
export type ThemeColor = 'blue' | 'purple' | 'green' | 'brown' | 'gray';

// Theme configurations
const themeConfigs: Record<ThemeColor, { light: ThemeOptions; dark: ThemeOptions }> = {
  blue: {
    light: {
      palette: {
        mode: 'light',
        primary: { main: '#1976d2' },
        secondary: { main: '#dc004e' },
      },
    },
    dark: {
      palette: {
        mode: 'dark',
        primary: { main: '#90caf9' },
        secondary: { main: '#f48fb1' },
      },
    },
  },
  purple: {
    light: {
      palette: {
        mode: 'light',
        primary: { main: '#7b1fa2' },
        secondary: { main: '#f50057' },
      },
    },
    dark: {
      palette: {
        mode: 'dark',
        primary: { main: '#ba68c8' },
        secondary: { main: '#ff4081' },
      },
    },
  },
  green: {
    light: {
      palette: {
        mode: 'light',
        primary: { main: '#2e7d32' },
        secondary: { main: '#f50057' },
      },
    },
    dark: {
      palette: {
        mode: 'dark',
        primary: { main: '#66bb6a' },
        secondary: { main: '#ff4081' },
      },
    },
  },
  brown: {
    light: {
      palette: {
        mode: 'light',
        primary: { main: '#795548' },
        secondary: { main: '#ff9800' },
      },
    },
    dark: {
      palette: {
        mode: 'dark',
        primary: { main: '#a1887f' },
        secondary: { main: '#ffa726' },
      },
    },
  },
  gray: {
    light: {
      palette: {
        mode: 'light',
        primary: { main: '#607d8b' },
        secondary: { main: '#ff9800' },
      },
    },
    dark: {
      palette: {
        mode: 'dark',
        primary: { main: '#90a4ae' },
        secondary: { main: '#ffa726' },
      },
    },
  },
};

interface ThemeContextType {
  theme: Theme;
  themeColor: ThemeColor;
  themeMode: ThemeMode;
  setThemeColor: (color: ThemeColor) => void;
  setThemeMode: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useAppTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useAppTheme must be used within a ThemeProvider');
  }
  return context;
};

const getStoredThemePreferences = (): { color: ThemeColor; mode: ThemeMode } => {
  const storedColor = localStorage.getItem('themeColor') as ThemeColor;
  const storedMode = localStorage.getItem('themeMode') as ThemeMode;
  return {
    color: storedColor || 'blue',
    mode: storedMode || 'light',
  };
};

interface ThemeProviderProps {
  children: ReactNode;
}

export const AppThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const stored = getStoredThemePreferences();
  const [themeColor, setThemeColorState] = useState<ThemeColor>(stored.color);
  const [themeMode, setThemeModeState] = useState<ThemeMode>(stored.mode);

  const setThemeColor = (color: ThemeColor) => {
    setThemeColorState(color);
    localStorage.setItem('themeColor', color);
  };

  const setThemeMode = (mode: ThemeMode) => {
    setThemeModeState(mode);
    localStorage.setItem('themeMode', mode);
  };

  const theme = useMemo(() => {
    const config = themeConfigs[themeColor][themeMode];
    return createTheme(config);
  }, [themeColor, themeMode]);

  return (
    <ThemeContext.Provider value={{ theme, themeColor, themeMode, setThemeColor, setThemeMode }}>
      {children}
    </ThemeContext.Provider>
  );
}; 