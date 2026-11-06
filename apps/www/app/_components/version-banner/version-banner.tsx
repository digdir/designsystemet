import { Alert, Link, Paragraph } from '@digdir/designsystemet-react';
import { useTranslation } from 'react-i18next';
import { useRouteLoaderData } from 'react-router';
import type { loader } from '~/root';
import classes from './version-banner.module.css';

export function VersionBanner() {
  const { t } = useTranslation();
  const version =
    useRouteLoaderData<typeof loader>('root')?.documentationVersion;

  if (!version) return null;

  return (
    <Alert data-color='warning' data-size='sm' className={classes.banner}>
      <Paragraph>
        {t('version-banner.message', { version })}{' '}
        <Link href='https://www.designsystemet.no/'>
          https://www.designsystemet.no/
        </Link>
        .
      </Paragraph>
    </Alert>
  );
}
