import React from 'react';
import { CssBaseline, ThemeProvider } from '@mui/material';
import CharacterSheet from './components/CharacterSheet';
import { LanguageProvider } from './contexts/LanguageContext';
import { AppThemeProvider, useAppTheme } from './contexts/ThemeContext';

const ThemedApp: React.FC = () => {
  const { theme } = useAppTheme();
  
  return (
    <ThemeProvider theme={theme}>
      <LanguageProvider>
        <CssBaseline />
        <CharacterSheet />
      </LanguageProvider>
    </ThemeProvider>
  );
};

function App() {
  return (
    <AppThemeProvider>
      <ThemedApp />
    </AppThemeProvider>
  );
}

export default App;
