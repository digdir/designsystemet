import { Heading } from '@digdir/designsystemet-react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router';
import { useThemebuilder } from '~/routes/themebuilder/_utils/use-themebuilder';
import type { ThemebuilderTabs } from '~/routes/themebuilder/themebuilder';
import classes from './theme-header.module.css';

export const ThemeHeader = () => {
  const { t } = useTranslation();
  const [, setQuery] = useSearchParams();
  const { tab } = useThemebuilder();

  const tabs: {
    name: string;
    value: ThemebuilderTabs;
  }[] = [
    { name: t('tabs.colorsystem'), value: 'colorsystem' },
    { name: t('tabs.examples'), value: 'examples' },
    // { name: t('tabs.variables'), value: 'variables' }, // hide variables tab for now
  ];

  return (
    <div className={classes.header}>
      <div className={classes.headerContent}>
        <div className={classes.textContainer}>
          <Heading data-size='md' level={1}>
            {t('themeBuilder.title')}
          </Heading>
        </div>
        {/* Tabs that change between overview and */}
        <div data-size='md' className={classes.tabs}>
          {tabs.map((themeTab) => (
            <button
              key={themeTab.value}
              className='ds-focus-visible'
              onClick={() => {
                setQuery(
                  (prev) => {
                    prev.set('tab', themeTab.value);
                    return prev;
                  },
                  {
                    /* we don't want to prevent scroll here, since we change tabs */
                    replace: true,
                  },
                );
              }}
              data-active={tab === themeTab.value}
            >
              {themeTab.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
