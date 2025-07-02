import { Button, Heading, Paragraph } from '@digdir/designsystemet-react';
import { ContentContainer } from '@internal/components';
import { BookIcon, PaletteIcon } from '@navikt/aksel-icons';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { Previews } from '~/_components/previews/previews';
import { generateMetadata } from '~/_utils/metadata';
import i18n from '~/i18next.server';
import type { Route } from './+types/home';
import classes from './home.module.css';

export const loader = async ({ params: { lang } }: Route.ComponentProps) => {
  const t = await i18n.getFixedT(lang);

  return {
    lang,
    metadata: generateMetadata({
      title: t('meta.title'),
      description: t('meta.description'),
    }),
  };
};

export const meta: Route.MetaFunction = ({ data }: Route.MetaArgs) => {
  if (!data?.metadata)
    return [
      {
        title: 'Theme Builder - Designsystemet',
        description: 'Build your own theme for Designsystemet',
      },
    ];
  return data.metadata;
};

export default function Home({ params: { lang } }: Route.ComponentProps) {
  const { t } = useTranslation();

  useEffect(() => {
    window.addEventListener('scroll', isSticky);
    return () => {
      window.removeEventListener('scroll', isSticky);
    };
  }, []);

  const isSticky = () => {
    const header = document.querySelector('.pickers');
    const scrollTop = window.scrollY;
    if (header) {
      scrollTop >= 250
        ? header.classList.add('is-sticky')
        : header.classList.remove('is-sticky');
    }
  };
  return (
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
              <Link
                to={`https://www.designsystemet.no/${lang}/fundamentals/themebuilder/own-theme`}
              >
                <BookIcon fontSize='1.5rem' aria-hidden />
                {t('themeBuilder.documentation')}
              </Link>
            </Button>
          </div>
        </div>
        <Previews />
      </ContentContainer>
    </main>
  );
}
