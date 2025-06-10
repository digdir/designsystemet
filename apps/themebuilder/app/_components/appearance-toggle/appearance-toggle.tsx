import { Button } from '@digdir/designsystemet-react';
import type { ColorScheme } from '@digdir/designsystemet/color';
import { MoonIcon, SunIcon } from '@navikt/aksel-icons';
import cl from 'clsx/lite';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useThemeStore } from '~/store';
import classes from './appearance-toggle.module.css';

type AppearanceToggleProps = {
  showLabel?: boolean;
};

export const AppearanceToggle = ({
  showLabel = false,
}: AppearanceToggleProps) => {
  const { t } = useTranslation();
  const colorSchemes: {
    name: string;
    value: ColorScheme;
  }[] = [
    { name: t('appearanceToggle.light'), value: 'light' },
    { name: t('appearanceToggle.dark'), value: 'dark' },
  ];

  const colorScheme = useThemeStore((state) => state.colorScheme);
  const setColorScheme = useThemeStore((state) => state.setColorScheme);

  const [active, setActive] = useState(colorScheme);

  useEffect(() => {
    setActive(colorScheme);
  }, [colorScheme]);

  return (
    <div className={classes.toggle} role='radiogroup'>
      {colorSchemes.map((colorScheme) => (
        <Button
          data-size='sm'
          className={cl(classes.item)}
          key={colorScheme.value}
          onClick={() => {
            setActive(colorScheme.value);
            setColorScheme(colorScheme.value);
          }}
          variant={colorScheme.value === active ? 'primary' : 'secondary'}
          data-color='neutral'
          aria-label={`${t('appearanceToggle.set-to')} ${colorScheme.name} ${t('appearanceToggle.view')}`}
          // biome-ignore lint/a11y/useSemanticElements: <explanation>
          role='radio'
          aria-checked={colorScheme.value === active}
          aria-current={colorScheme.value === active}
        >
          {' '}
          {colorScheme.value === 'light' && (
            <SunIcon aria-hidden fontSize='1.5rem' />
          )}
          {colorScheme.value === 'dark' && (
            <MoonIcon aria-hidden fontSize='1.5rem' />
          )}
          {colorScheme.name}
          {showLabel && <>{colorScheme.name}</>}
        </Button>
      ))}
    </div>
  );
};
