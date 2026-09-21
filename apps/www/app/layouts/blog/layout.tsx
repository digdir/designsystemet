import { Heading, Link, Paragraph } from '@digdir/designsystemet-react';
import { Trans, useTranslation } from 'react-i18next';
import { Outlet } from 'react-router';
import classes from './layout.module.css';

export { ErrorBoundary } from '~/root';

export default function Layout() {
  const {
    t,
    i18n: { language },
  } = useTranslation();

  return (
    <div className='l-content-container' id='main'>
      <div className={classes.header}>
        <Heading data-size='lg' level={1}>
          {t('blog.title')}
        </Heading>
        <Paragraph data-size='lg'>
          <Trans t={t} i18nKey={'blog.description'}>
            <Link href={`/${language}/blog/feed.rss`}>RSS</Link>
            <Link href={`/${language}/blog/feed.atom`}>Atom</Link>
          </Trans>
        </Paragraph>
      </div>
      <div className={classes.main}>
        <Outlet />
      </div>
    </div>
  );
}
