import { Button, Heading, Paragraph } from '@digdir/designsystemet-react';
import { forwardRef, type HTMLAttributes } from 'react';
import { useTranslation } from 'react-i18next';
import { CONSENT_VERSION, userConsent } from '~/_utils/cookies';
import { RRLink as Link } from '../link';
import classes from './consent-banner.module.css';

type BannerProps = { lang: string } & HTMLAttributes<HTMLElement>;

const hideIfAnsweredScript = `(function(){try{var m=document.cookie.match(/(?:^|; )${userConsent.name}=([^;]+)/);if(m&&JSON.parse(atob(decodeURIComponent(m[1]))).version===${JSON.stringify(CONSENT_VERSION)})document.currentScript.previousElementSibling.hidden=true}catch(e){}})()`;

export const ConsentBanner = forwardRef<HTMLElement, BannerProps>(
  function ConsentBanner({ lang, ...rest }, ref) {
    const { t } = useTranslation();

    return (
      <>
        <section
          aria-labelledby='consent-banner-heading'
          className={classes.consentBanner}
          /* The inline script below may have set `hidden` before hydration */
          suppressHydrationWarning
          {...rest}
          ref={ref}
        >
          <div className={classes.container}>
            <Heading id='consent-banner-heading' level={2} data-size='sm'>
              {t('consent-banner.heading')}
            </Heading>
            <Paragraph>
              {t('consent-banner.desc-start')} {t('consent-banner.desc-end')}{' '}
              <Link
                to={`/${lang}/intro/privacy-policy#${lang === 'no' ? 'valgfrie-informasjonskapsler' : 'optional-cookies'}`}
              >
                {t('consent-banner.desc-link')}
              </Link>
            </Paragraph>
            <form
              method='post'
              action='/api/consent'
              className={classes.buttons}
            >
              <Button
                type='submit'
                name='action'
                value='approve'
                data-color='neutral'
                data-size='sm'
              >
                {t('consent-banner.approve')}
              </Button>
              <Button
                type='submit'
                name='action'
                value='decline'
                data-color='neutral'
                data-size='sm'
              >
                {t('consent-banner.decline')}
              </Button>
            </form>
            <Paragraph className={classes.necessaryInfo} data-size='sm'>
              <Link
                to={`/${lang}/intro/privacy-policy#${lang === 'no' ? 'nødvendige-informasjonskapsler' : 'necessary-cookies'}`}
              >
                {t('consent-banner.necessary-info-link')}
              </Link>{' '}
              {t('consent-banner.necessary-info-end')}
            </Paragraph>
          </div>
        </section>
        <script
          // biome-ignore lint/security/noDangerouslySetInnerHtml: static script built from constants
          dangerouslySetInnerHTML={{ __html: hideIfAnsweredScript }}
        />
      </>
    );
  },
);
