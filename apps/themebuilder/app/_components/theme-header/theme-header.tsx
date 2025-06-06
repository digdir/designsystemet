import { Heading } from '@digdir/designsystemet-react';
import { RRLink } from '@internal/components/src/link';
import { ChevronLeftIcon } from '@navikt/aksel-icons';
import { useTranslation } from 'react-i18next';
import { useRouteLoaderData } from 'react-router';
import { useThemeStore } from '~/store';
import classes from './theme-header.module.css';

export const ThemeHeader = () => {
  const { t } = useTranslation();
  const { lang } = useRouteLoaderData('root');
  const themeTab = useThemeStore((state) => state.themeTab);
  const setThemeTab = useThemeStore((state) => state.setThemeTab);

  const tabs: {
    name: string;
    value: 'overview' | 'colorsystem';
  }[] = [
    { name: t('tabs.overview'), value: 'overview' },
    { name: t('tabs.colorsystem'), value: 'colorsystem' },
  ];

  return (
    <div className={classes.header}>
      <div className={classes.textContainer}>
        <RRLink data-size='sm' className={classes.backLink} to={`/${lang}/`}>
          <ChevronLeftIcon aria-hidden fontSize='1.5rem' />
          {t('header.back-to-home')}
        </RRLink>
        <Heading data-size='md' level={1}>
          {t('themeBuilder.title')}
        </Heading>
      </div>
      {/* Tabs that change between overview and */}
      <div data-size='md' className={classes.tabs}>
        {tabs.map((tab) => (
          <button
            key={tab.value}
            className='ds-focus-visible'
            onClick={() => setThemeTab(tab.value)}
            data-active={themeTab === tab.value}
          >
            {tab.name}
          </button>
        ))}
      </div>
    </div>
  );
};
