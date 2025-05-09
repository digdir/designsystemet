import {
  type ColorScheme,
  type CssColor,
  colorMetadata,
  generateColorSchemes,
} from '@digdir/designsystemet/color';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { useThemeStore } from '../../../store';

export const useThemeParams = () => {
  const query = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const colors = useThemeStore((state) => state.colors);
  const colorScheme = useThemeStore((state) => state.colorScheme);
  const baseBorderRadius = useThemeStore((state) => state.baseBorderRadius);
  const setBorderRadius = useThemeStore((state) => state.setBaseBorderRadius);

  /* Check if we have params in URL */
  useEffect(() => {
    if (query.get('appearance')) {
      useThemeStore.setState({
        colorScheme: query.get('appearance') as ColorScheme,
      });
    }

    const newColors = {
      ...colors,
    };

    if (query.get('main')) {
      const mainColors = createColorsFromQuery(query.get('main') as string);

      if (mainColors) {
        newColors.main = mainColors.map((color) => ({
          ...color,
        }));
      }
    }

    if (query.get('neutral')) {
      const neutralColor = query.get('neutral') as string;

      if (neutralColor)
        newColors.neutral = [
          {
            name: 'neutral',
            colors: generateColorSchemes('#1E2B3C'),
            colorMetadata: JSON.parse(JSON.stringify(colorMetadata)),
          },
        ];
    }

    if (query.get('support')) {
      const supportColors = createColorsFromQuery(
        query.get('support') as string,
      );

      if (supportColors) {
        newColors.support = supportColors.map((color) => ({
          ...color,
        }));
      }
    }

    useThemeStore.setState({
      colors: newColors,
    });

    const borderRadius = parseInt(query.get('border-radius') as string);
    if (!Number.isNaN(borderRadius)) {
      setBorderRadius(borderRadius);
    }
  }, []);

  /* When name, appearance or colors change, update query */
  useEffect(() => {
    const params = new URLSearchParams(query.toString());

    const mainColorString = colors.main
      .map((color) => `${color.name}:${color.colors.light[11].hex}`)
      .join(' ');

    const neutralColorString = colors.neutral[0]
      ? colors.neutral[0].colors.light[11].hex
      : '';

    const supportColorString = colors.support
      .map((color) => `${color.name}:${color.colors.light[11].hex}`)
      .join(' ');

    params.set('appearance', colorScheme);
    params.set('main', mainColorString);
    params.set('neutral', neutralColorString);
    params.set('support', supportColorString);
    params.set('border-radius', baseBorderRadius.toString());

    router.replace(pathname + '?' + params.toString(), {
      scroll: false,
    });
  }, [colors, colorScheme, baseBorderRadius]);

  return null;
};

function createColorsFromQuery(colors: string) {
  return colors.split(' ').map((color) => {
    const [name, hex] = color.split(':');
    return {
      name,
      colors: generateColorSchemes(hex as CssColor),
      colorMetadata: JSON.parse(JSON.stringify(colorMetadata)),
    };
  });
}
