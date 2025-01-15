import { Heading, Link } from '@digdir/designsystemet-react';
import { ChevronLeftIcon } from '@navikt/aksel-icons';
import NextLink from 'next/link';
import { useThemeStore } from '../../store';
import classes from './Header.module.css';

const tabs: {
  name: string;
  value: 'overview' | 'colorsystem';
}[] = [
  { name: 'Oversikt', value: 'overview' },
  { name: 'Fargesystem', value: 'colorsystem' },
];

export const Header = () => {
  const colors = useThemeStore((state) => state.colors);
  const appearance = useThemeStore((state) => state.appearance);
  const themeTab = useThemeStore((state) => state.themeTab);
  const setThemeTab = useThemeStore((state) => state.setThemeTab);

  const getHeaderColor = (): { background: string; color: string } => {
    if (colors.main.length === 0) {
      return { background: '#D9D9D9', color: '#000' };
    }

    const str = colors.main[0].colors[appearance][3].hex;
    if (colors.main.length > 1) {
      return {
        background:
          'linear-gradient(90deg, ' +
          colors.main[0].colors[appearance][3].hex +
          ' 0%, ' +
          colors.main[1].colors[appearance][3].hex +
          ' 60%);',
        color: colors.main[0].colors[appearance][12].hex,
      };
    }

    return {
      background: str,
      color: colors.main[0].colors[appearance][12].hex,
    };
  };

  return (
    <div className={classes.headerContainer}>
      <div
        className={classes.header}
        style={{ ...getHeaderColor() }}
        data-color-scheme={appearance}
      >
        <Link data-size='sm' className={classes.backLink} asChild>
          <NextLink href='/'>
            <ChevronLeftIcon title='a11y-title' fontSize='1.5rem' />
            Gå tilbake til forsiden
          </NextLink>
        </Link>
        <Heading data-size='md'>Temabygger</Heading>
      </div>
      {/* Tabs that change between overview and */}
      <div data-size='md' className={classes.tabs}>
        {tabs.map((tab) => (
          <button
            key={tab.value}
            className='ds-focus-visible'
            onClick={() => setThemeTab(tab.value)}
            data-active={themeTab === tab.value}
            style={{
              color:
                themeTab !== tab.value ? getHeaderColor().color : 'inherit',
            }}
          >
            {tab.name}
          </button>
        ))}
      </div>
    </div>
  );
};
