import type { ColorScheme } from '@digdir/designsystemet/internal';
import { useUrlParam } from './use-url-param';

/** The colour scheme the theme is shown in. It is kept in `appearance` in the URL, and this is the only place that reads and writes it. */
export const useColorScheme = (): [
  ColorScheme,
  (colorScheme: ColorScheme) => void,
] => {
  const [appearance, setColorScheme] = useUrlParam('appearance', {
    preventScrollReset: true,
  });
  return [appearance === 'dark' ? 'dark' : 'light', setColorScheme];
};
