'use client';

import { useThemeStore } from '../../store';

type ThemeWrapperProps = {
  children: React.ReactNode;
};

export const ThemeWrapper = ({ children }: ThemeWrapperProps) => {
  const appearance = useThemeStore((state) => state.appearance);
  const theme = useThemeStore((state) => state.themePreview);

  return (
    <div data-color-scheme={appearance} data-theme={theme}>
      {children}
    </div>
  );
};
