import { Button, Heading, Paragraph } from '@digdir/designsystemet-react';
import { forwardRef, type HTMLAttributes } from 'react';
import { useTranslation } from 'react-i18next';
import { RRLink as Link } from '../link';
import classes from './cookie-banner.module.css';

type BannerProps = { lang: string } & HTMLAttributes<HTMLDivElement>;

export const CookieBanner = forwardRef<HTMLDivElement, BannerProps>(
  function CookieBanner({ lang, ...rest }, ref) {
    const { t } = useTranslation();

    return (
      <div className={classes.cookieBanner} {...rest} ref={ref}>
        <div className={classes.container}>
          <Heading level={2} data-size='lg'>
            {t('cookie-banner.heading')}
          </Heading>
          <Paragraph>
            <span>{t('cookie-banner.all')}:</span> {t('cookie-banner.all-desc')}
          </Paragraph>
          <Paragraph>
            <span>{t('cookie-banner.required')}:</span>{' '}
            {t('cookie-banner.required-desc')}
          </Paragraph>
          <Paragraph>
            {t('cookie-banner.declaration1')}{' '}
            <Link to={`/${lang}/intro/privacy-policy`}>
              {t('cookie-banner.declaration2')}
            </Link>
          </Paragraph>
          <div className={classes.buttons}>
            <Button data-color='neutral'>{t('cookie-banner.all')}</Button>
            <Button data-color='neutral'>{t('cookie-banner.required')}</Button>
          </div>
        </div>
      </div>
    );
  },
);
