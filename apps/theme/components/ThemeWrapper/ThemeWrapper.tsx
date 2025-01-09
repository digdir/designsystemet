'use client';

import { useThemeStore } from '../../store';

type ThemeWrapperProps = {
  children: React.ReactNode;
};

export const ThemeWrapper = ({ children }: ThemeWrapperProps) => {
  const theme = useThemeStore((state) => state.themePreview);

  return <div data-theme={theme}>{children}</div>;
};
