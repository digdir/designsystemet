import type { ColorScheme } from '@digdir/designsystemet/internal';
import { ToggleGroup } from '@digdir/designsystemet-react';
import { MoonIcon, SunIcon } from '@navikt/aksel-icons';
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
    <ToggleGroup
      className={classes.group}
      aria-label={t('appearanceToggle.label')}
      value={colorScheme}
      variant='secondary'
      data-size='sm'
      onChange={(value) =>
        setQuery(
          (previous) => {
            previous.set('appearance', value);
            return previous;
          },
          { replace: true, preventScrollReset: true },
        )
      }
    >
      {colorSchemes.map((scheme) => (
        <ToggleGroup.Item
          className={classes.item}
          key={scheme.value}
          value={scheme.value}
        >
          {' '}
          {scheme.value === 'light' && <SunIcon aria-hidden />}
          {scheme.value === 'dark' && <MoonIcon aria-hidden />}
          {scheme.name}
          {showLabel && <>{scheme.name}</>}
        </ToggleGroup.Item>
      ))}
    </ToggleGroup>
  );
};
