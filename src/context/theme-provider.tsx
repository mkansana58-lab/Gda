'use client';

import * as React from 'react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { type ThemeProviderProps } from 'next-themes/dist/types';

interface CustomThemeProviderProps extends ThemeProviderProps {
  children: React.ReactNode;
}

const ThemeContext = React.createContext<{
  isEyeComfortMode: boolean;
  toggleEyeComfortMode: () => void;
} | null>(null);

export function ThemeProvider({ children, ...props }: CustomThemeProviderProps) {
  const [isEyeComfortMode, setIsEyeComfortMode] = React.useState(false);

  React.useEffect(() => {
    const isComfort = localStorage.getItem('eye-comfort-mode') === 'true';
    setIsEyeComfortMode(isComfort);
    document.body.classList.toggle('eye-comfort-mode', isComfort);
  }, []);

  const toggleEyeComfortMode = () => {
    const newComfortMode = !isEyeComfortMode;
    setIsEyeComfortMode(newComfortMode);
    localStorage.setItem('eye-comfort-mode', String(newComfortMode));
    document.body.classList.toggle('eye-comfort-mode', newComfortMode);
  };

  return (
    <NextThemesProvider {...props}>
      <ThemeContext.Provider value={{ isEyeComfortMode, toggleEyeComfortMode }}>
        {children}
      </ThemeContext.Provider>
    </NextThemesProvider>
  );
}

export const useTheme = () => {
  const context = React.useContext(ThemeContext);
  if (context === null) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
