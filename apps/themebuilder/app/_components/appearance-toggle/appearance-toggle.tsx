import type { ColorScheme } from '@digdir/designsystemet/color';
import { Button } from '@digdir/designsystemet-react';
import { MoonIcon, SunIcon } from '@navikt/aksel-icons';
import cl from 'clsx/lite';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router';
import { useThemebuilder } from '~/routes/themebuilder/_utils/use-themebuilder';
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

  const { colorScheme } = useThemebuilder();
  const [, setQuery] = useSearchParams();

  return (
    <div className={classes.toggle} role='radiogroup'>
      {colorSchemes.map((scheme) => (
        <Button
          data-size='sm'
          className={cl(classes.item)}
          key={scheme.value}
          onClick={() => {
            setQuery(
              (prev) => {
                prev.set('appearance', scheme.value);
                return prev;
              },
              {
                replace: true,
                preventScrollReset: true,
              },
            );
          }}
          variant={scheme.value === colorScheme ? 'primary' : 'secondary'}
          data-color='neutral'
          aria-label={`${t('appearanceToggle.set-to')} ${scheme.name} ${t('appearanceToggle.view')}`}
          aria-checked={scheme.value === colorScheme}
          aria-current={scheme.value === colorScheme}
          role='radio'
        >
          {' '}
          {scheme.value === 'light' && (
            <SunIcon aria-hidden fontSize='1.5rem' />
          )}
          {scheme.value === 'dark' && (
            <MoonIcon aria-hidden fontSize='1.5rem' />
          )}
          {scheme.name}
          {showLabel && <>{scheme.name}</>}
        </Button>
      ))}
    </div>
  );
};
