import { Heading, Link } from '@digdir/designsystemet-react';
import { ChevronLeftIcon } from '@navikt/aksel-icons';
import NextLink from 'next/link';
import { useThemeStore } from '../../store';
import classes from './ThemeHeader.module.css';

export const ThemeHeader = () => {
  const themeTab = useThemeStore((state) => state.themeTab);
  const setThemeTab = useThemeStore((state) => state.setThemeTab);

  return (
    <div className={classes.header}>
      <div className={classes.headerContent}>
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
      </div>
    </div>
  );
};
