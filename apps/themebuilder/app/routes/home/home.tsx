import { Button, Heading, Paragraph } from '@digdir/designsystemet-react';
import { ContentContainer } from '@internal/rr-components';
import { BookIcon, PaletteIcon } from '@navikt/aksel-icons';
import { useEffect } from 'react';
import { Link, useSearchParams } from 'react-router';
import { Previews } from '~/_components/previews/previews';
import type { Route } from './+types/home';
import classes from './home.module.css';

export default function Home({ params: { lang } }: Route.ComponentProps) {
  const [searchParams] = useSearchParams();
  const params = new URLSearchParams(searchParams);

  useEffect(() => {
    // Sticky Menu Area
    window.addEventListener('scroll', isSticky);
    return () => {
      window.removeEventListener('scroll', isSticky);
    };
  }, []);

  /**
   * Check if the header should be sticky
   */
  const isSticky = () => {
    const header = document.querySelector('.pickers');
    const scrollTop = window.scrollY;
    if (header) {
      scrollTop >= 250
        ? header.classList.add('is-sticky')
        : header.classList.remove('is-sticky');
    }
  };

  /* get theme from query on initial load */
  useEffect(() => {
    const borderRadius = params.get('borderRadius') as string;
    if (typeof borderRadius === 'string') {
    }
  }, []);

  return (
    <div>
      <main className={classes.main} id='main'>
        <ContentContainer>
          <div className={classes.header}>
            <Paragraph data-size='lg'>Designsystemet sin temabygger</Paragraph>
            <Heading data-size='xl' level={1} className={classes.heading}>
              Sett i gang med å bygge ditt
              <span className={classes.headerText}> eget tema</span>
            </Heading>
            <Paragraph data-size='md' variant='long' className={classes.desc}>
              Skal du ta i bruk Designsystemet i din egen organisasjon med dine
              egne profilfarger og preferanser? Temabyggeren hjelper deg i gang.
            </Paragraph>
            <div className={classes.btnGroup}>
              <Button data-color='neutral' asChild>
                <Link to={`/${lang}/themebuilder`}>
                  <PaletteIcon fontSize='1.5rem' aria-hidden />
                  Bygg tema
                </Link>
              </Button>
              <Button data-color='neutral' variant='secondary' asChild>
                <Link to='https://www.designsystemet.no/grunnleggende/for-designere/eget-tema'>
                  <BookIcon fontSize='1.5rem' aria-hidden />
                  Dokumentasjon
                </Link>
              </Button>
            </div>
          </div>
          <Previews />
        </ContentContainer>
      </main>
    </div>
  );
}
