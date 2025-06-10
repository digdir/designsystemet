import { useState } from 'react';

import {
  type ColorScheme,
  type CssColor,
  generateColorSchemes,
} from '@digdir/designsystemet';
import { ToggleGroup } from '@digdir/designsystemet-react';
import { useTranslation } from 'react-i18next';
import { generateColorVars } from '~/_utils/generate-color-vars';
import { OverviewComponents } from '../overview-components/overview-components';
import classes from './previews.module.css';

const themes: {
  [key: string]: {
    name: string;
    value: string;
    hex: CssColor;
    borderRadius?: number;
  };
} = {
  blue: {
    name: 'Eksempel 1',
    value: 'blue',
    hex: '#0062BA',
    borderRadius: 4,
  },
  purple: {
    name: 'Eksempel 2',
    value: 'purple',
    hex: '#740c7e',
    borderRadius: 9999,
  },
};

export const Previews = () => {
  const { t } = useTranslation();
  const [theme, setTheme] = useState<keyof typeof themes>('blue');
  const [colorScheme, setColorScheme] = useState<ColorScheme>('light');

  const getThemeVariables = (hex: CssColor) => {
    const generatedTheme = generateColorSchemes(hex);
    const vars = {} as Record<string, string>;

    Object.assign(vars, generateColorVars(generatedTheme, colorScheme));

    return vars;
  };

  return (
    <>
      <div className={classes.toolbar} data-size='sm'>
        <ToggleGroup
          value={theme as string}
          onChange={(v) => setTheme(v as keyof typeof themes)}
        >
          <ToggleGroup.Item value='blue'>
            {t('examples.example-1')}
          </ToggleGroup.Item>
          <ToggleGroup.Item value='purple'>
            {t('examples.example-2')}
          </ToggleGroup.Item>
        </ToggleGroup>
        <ToggleGroup
          value={colorScheme}
          onChange={(v) => setColorScheme(v as ColorScheme)}
        >
          <ToggleGroup.Item value='light'>
            {t('colorPreview.light')}
          </ToggleGroup.Item>
          <ToggleGroup.Item value='dark'>
            {t('colorPreview.dark')}
          </ToggleGroup.Item>
        </ToggleGroup>
      </div>

      <div className={classes.preview} data-color-scheme={colorScheme}>
        <OverviewComponents
          colorScheme={colorScheme}
          color={themes[theme].hex}
          borderRadius={themes[theme].borderRadius}
        />
      </div>
    </>
  );
};
