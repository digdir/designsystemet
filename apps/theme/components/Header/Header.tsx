import { Heading, Link } from '@digdir/designsystemet-react';
import { ChevronLeftIcon } from '@navikt/aksel-icons';
import NextLink from 'next/link';
import { useThemeStore } from '../../store';
import classes from './Header.module.css';

export const Header = () => {
  const colors = useThemeStore((state) => state.colors);
  const appearance = useThemeStore((state) => state.appearance);
  type TestProps = 'light' | 'dark';

  const setHeaderColor = () => {
    let themeMode: TestProps = 'light';
    if (colors.main.length === 0) {
      return '#D9D9D9';
    }
    if (appearance === 'dark') {
      themeMode = 'dark';
    }
    const str = colors.main[0].colors[themeMode][3].hex;
    if (colors.main.length > 1) {
      return (
        'linear-gradient(90deg, ' +
        colors.main[0].colors[themeMode][3].hex +
        ' 0%, ' +
        colors.main[1].colors[themeMode][3].hex +
        ' 60%)'
      );
    }
    return str;
  };

  return (
    <div
      className={classes.header}
      style={{ background: setHeaderColor() }}
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
  );
};
