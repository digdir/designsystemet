import { Button, Heading, Paragraph } from '@digdir/designsystemet-react';
import { ContentContainer } from '@internal/rr-components';
import { BookIcon, PaletteIcon } from '@navikt/aksel-icons';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useSearchParams } from 'react-router';
import { Previews } from '~/_components/previews/previews';
import type { Route } from './+types/home';
import classes from './home.module.css';

export default function Home({ params: { lang } }: Route.ComponentProps) {
  const [searchParams] = useSearchParams();
  const params = new URLSearchParams(searchParams);
  const { t } = useTranslation();

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
            <Paragraph data-size='lg'>{t('themeBuilder.intro')}</Paragraph>
            <Heading data-size='xl' level={1} className={classes.heading}>
              {t('themeBuilder.heading')}{' '}
              <span className={classes.headerText}>
                {t('themeBuilder.heading-highlight')}
              </span>
            </Heading>
            <Paragraph data-size='md' variant='long' className={classes.desc}>
              {t('themeBuilder.description')}
            </Paragraph>
            <div className={classes.btnGroup}>
              <Button data-color='neutral' asChild>
                <Link to={`/${lang}/themebuilder`}>
                  <PaletteIcon fontSize='1.5rem' aria-hidden />
                  {t('themeBuilder.build-theme')}
                </Link>
              </Button>
              <Button data-color='neutral' variant='secondary' asChild>
                <Link to='https://www.designsystemet.no/grunnleggende/for-designere/eget-tema'>
                  <BookIcon fontSize='1.5rem' aria-hidden />
                  {t('themeBuilder.documentation')}
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
