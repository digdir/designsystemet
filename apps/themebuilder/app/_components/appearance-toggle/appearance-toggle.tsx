import type { ColorScheme } from '@digdir/designsystemet/internal';
import { ToggleGroup } from '@digdir/designsystemet-react';
import { MoonIcon, SunIcon } from '@navikt/aksel-icons';
import { useTranslation } from 'react-i18next';
import { useColorScheme } from '~/_hooks/use-color-scheme';
import classes from './appearance-toggle.module.css';

/** Switches the colour scheme the theme is shown in */
export const AppearanceToggle = () => {
  const { t } = useTranslation();
  const [colorScheme, setColorScheme] = useColorScheme();

  return (
    <ToggleGroup
      className={classes.group}
      aria-label={t('appearanceToggle.label')}
      value={colorScheme}
      variant='secondary'
      data-size='sm'
      onChange={(value) => setColorScheme(value as ColorScheme)}
    >
      <ToggleGroup.Item className={classes.item} value='light'>
        <SunIcon aria-hidden />
        {t('appearanceToggle.light')}
      </ToggleGroup.Item>
      <ToggleGroup.Item className={classes.item} value='dark'>
        <MoonIcon aria-hidden />
        {t('appearanceToggle.dark')}
      </ToggleGroup.Item>
    </ToggleGroup>
  );
};
