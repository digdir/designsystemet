import { Button, Heading, Paragraph } from '@digdir/designsystemet-react';
import { forwardRef, type HTMLAttributes } from 'react';
import { useTranslation } from 'react-i18next';
import { RRLink as Link } from '../link';
import classes from './consent-banner.module.css';

type BannerProps = { lang: string } & HTMLAttributes<HTMLDivElement>;

export const ConsentBanner = forwardRef<HTMLDivElement, BannerProps>(
  function ConsentBanner({ lang, ...rest }, ref) {
    const { t } = useTranslation();

    return (
      <div className={classes.consentBanner} {...rest} ref={ref}>
        <div className={classes.container}>
          <Heading level={2} data-size='lg'>
            {t('consent-banner.heading')}
          </Heading>
          <Paragraph>
            <span>{t('consent-banner.all')}:</span>{' '}
            {t('consent-banner.all-desc')}
          </Paragraph>
          <Paragraph>
            <span>{t('consent-banner.required')}:</span>{' '}
            {t('consent-banner.required-desc')}
          </Paragraph>
          <Paragraph>
            {t('consent-banner.declaration1')}{' '}
            <Link to={`/${lang}/intro/privacy-policy`}>
              {t('consent-banner.declaration2')}
            </Link>
          </Paragraph>
          <form method='post' action='/api/consent' className={classes.buttons}>
            <Button
              type='submit'
              name='consent'
              value='required'
              data-color='neutral'
            >
              {t('consent-banner.required')}
            </Button>
            <Button
              type='submit'
              name='consent'
              value='all'
              data-color='neutral'
            >
              {t('consent-banner.all')}
            </Button>
          </form>
        </div>
      </div>
    );
  },
);
