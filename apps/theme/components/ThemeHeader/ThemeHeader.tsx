import { Heading, Link } from '@digdir/designsystemet-react';
import { ChevronLeftIcon } from '@navikt/aksel-icons';
import NextLink from 'next/link';
import { useThemeStore } from '../../store';
import classes from './ThemeHeader.module.css';

const tabs: {
  name: string;
  value: 'overview' | 'colorsystem';
}[] = [
  { name: 'Oversikt', value: 'overview' },
  { name: 'Fargesystem', value: 'colorsystem' },
];

export const ThemeHeader = () => {
  const themeTab = useThemeStore((state) => state.themeTab);
  const setThemeTab = useThemeStore((state) => state.setThemeTab);

  return (
    <div className={classes.header}>
      <div className={classes.textContainer}>
        <Link data-size='sm' className={classes.backLink} asChild>
          <NextLink href='/'>
            <ChevronLeftIcon aria-hidden fontSize='1.5rem' />
            Gå tilbake til forsiden
          </NextLink>
        </Link>
        <Heading data-size='md' level={1}>
          Temabygger
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
