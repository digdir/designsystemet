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
    cssVars?: Record<string, string>;
  };
} = {
  blue: {
    name: 'Eksempel 1',
    value: 'blue',
    hex: '#0062BA',
  },
  purple: {
    name: 'Eksempel 2',
    value: 'purple',
    hex: '#740c7e',
    cssVars: {
      '--ds-border-radius-base': '9999px',
      '--ds-border-radius-scale': '0.25rem',
      '--ds-border-radius-sm':
        'min(var(--ds-border-radius-base) * 0.5, var(--ds-border-radius-scale))',
      '--ds-border-radius-md':
        'min(var(--ds-border-radius-base), var(--ds-border-radius-scale) * 2)',
      '--ds-border-radius-lg':
        'min(var(--ds-border-radius-base) * 2, var(--ds-border-radius-scale) * 5)',
      '--ds-border-radius-xl':
        'min(var(--ds-border-radius-base) * 3, var(--ds-border-radius-scale) * 7)',
      '--ds-border-radius-default': 'var(--ds-border-radius-base)',
      '--ds-border-radius-full': '624.9375rem',
    },
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

      <div
        className={classes.preview}
        data-color-scheme={colorScheme}
        style={{
          ...getThemeVariables(themes[theme].hex),
          ...themes[theme].cssVars,
        }}
      >
        <OverviewComponents />
      </div>
    </>
  );
};
