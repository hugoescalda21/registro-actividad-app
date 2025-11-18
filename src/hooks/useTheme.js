import { useState, useEffect } from 'react';

const THEME_MODES = {
  LIGHT: 'light',
  DARK: 'dark',
  AUTO: 'auto'
};

export const useTheme = () => {
  // Obtener preferencia guardada o usar 'auto' por defecto
  const [themeMode, setThemeMode] = useState(() => {
    const saved = localStorage.getItem('themeMode');
    return saved || THEME_MODES.AUTO;
  });

  // Estado derivado: isDark se calcula basado en themeMode y preferencia del sistema
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Guardar preferencia en localStorage
    localStorage.setItem('themeMode', themeMode);

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const updateTheme = () => {
      let shouldBeDark = false;

      if (themeMode === THEME_MODES.DARK) {
        shouldBeDark = true;
      } else if (themeMode === THEME_MODES.LIGHT) {
        shouldBeDark = false;
      } else { // AUTO
        shouldBeDark = mediaQuery.matches;
      }

      setIsDark(shouldBeDark);

      if (shouldBeDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    };

    // Actualizar tema inmediatamente
    updateTheme();

    // Escuchar cambios en la preferencia del sistema (solo si está en modo auto)
    const handleChange = () => {
      if (themeMode === THEME_MODES.AUTO) {
        updateTheme();
      }
    };

    mediaQuery.addEventListener('change', handleChange);

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, [themeMode]);

  const setTheme = (mode) => {
    if (Object.values(THEME_MODES).includes(mode)) {
      setThemeMode(mode);
    }
  };

  const toggleTheme = () => {
    // Toggle simple entre light y dark (sin auto)
    setThemeMode(prev => prev === THEME_MODES.DARK ? THEME_MODES.LIGHT : THEME_MODES.DARK);
  };

  return {
    isDark,
    themeMode,
    setTheme,
    toggleTheme,
    THEME_MODES
  };
};