import type { ColorScheme } from '@digdir/designsystemet/internal';
import { useSearchParams } from 'react-router';

/** The colour scheme the theme is shown in. It is kept in `appearance` in the URL, and this is the only place that reads and writes it. */
export const useColorScheme = (): [
  ColorScheme,
  (colorScheme: ColorScheme) => void,
] => {
  const [params, setParams] = useSearchParams();

  const setColorScheme = (colorScheme: ColorScheme) =>
    setParams(
      (previous) => {
        previous.set('appearance', colorScheme);
        return previous;
      },
      { replace: true, preventScrollReset: true },
    );

  return [
    params.get('appearance') === 'dark' ? 'dark' : 'light',
    setColorScheme,
  ];
};
