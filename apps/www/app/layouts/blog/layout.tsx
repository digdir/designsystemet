import { Heading, Paragraph } from '@digdir/designsystemet-react';
import { useTranslation } from 'react-i18next';
import { Outlet } from 'react-router';
import classes from './layout.module.css';

export { ErrorBoundary } from '~/root';

export default function Layout() {
  const { t } = useTranslation();

  return (
    <div className='l-content-container' id='main'>
      <div className={classes.header}>
        <Heading data-size='lg' level={1}>
          {t('blog.title')}
        </Heading>
        <Paragraph data-size='lg'>{t('blog.description')}</Paragraph>
      </div>
      <div className={classes.main}>
        <Outlet />
      </div>
    </div>
  );
}
