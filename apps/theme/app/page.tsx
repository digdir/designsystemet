'use client';
import { Button, Heading, Paragraph } from '@digdir/designsystemet-react';
import type {} from '@digdir/designsystemet/color';
import {} from '@digdir/designsystemet/color';
import { Container } from '@internal/components';
import { BookIcon, PaletteIcon } from '@navikt/aksel-icons';
import NextLink from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

import { Previews } from '../components';
import classes from './page.module.css';

export default function Home() {
  const searchParams = useSearchParams();
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
        <Container>
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
                <NextLink href='/themebuilder'>
                  <PaletteIcon fontSize='1.5rem' aria-hidden />
                  Bygg tema
                </NextLink>
              </Button>
              <Button data-color='neutral' variant='secondary' asChild>
                <NextLink href='https://www.designsystemet.no/grunnleggende/for-designere/eget-tema'>
                  <BookIcon fontSize='1.5rem' aria-hidden />
                  Dokumentasjon
                </NextLink>
              </Button>
            </div>
          </div>
          <Previews />
        </Container>
      </main>
    </div>
  );
}
