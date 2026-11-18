import { Button } from '@digdir/designsystemet-react';
import { CheckmarkIcon, EyeIcon } from '@navikt/aksel-icons';
import { useTranslation } from 'react-i18next';
import { useThemeStore } from '~/model/theme-store';
import classes from './share-theme-dialog.module.css';

/**
 * Says whether the edits have reached the shared link, and when they will not: when saving fails, when the link is gone,
 * and when the config was opened from a link for viewing. Shows nothing for a config that is not shared.
 * Edits are shown at once and saved in the background, so this is the only place a problem with saving is seen.
 */
export const SyncStatus = () => {
  const { t } = useTranslation();
  const { syncStatus, retrySync, viewOnlyId } = useThemeStore();

  if (!syncStatus && !viewOnlyId) return null;
  const problem =
    syncStatus && syncStatus !== 'synced' && syncStatus !== 'syncing'
      ? syncStatus
      : null;

  return (
    <div className={classes.sync}>
      {!syncStatus && (
        <>
          <EyeIcon aria-hidden />
          {t('shareTheme.view-only')}
        </>
      )}
      {syncStatus === 'synced' && (
        <>
          <CheckmarkIcon aria-hidden />
          {t('shareTheme.synced')}
        </>
      )}
      {syncStatus === 'syncing' && t('shareTheme.syncing')}
      {/* Only problems are read out by screen readers. Every edit is synced, and reading each one out would drown out everything else. */}
      <span role='status' className={classes.problem}>
        {problem && t(`shareTheme.sync-${problem}`)}
      </span>
      {problem === 'failed' && (
        <Button variant='tertiary' data-size='sm' onClick={retrySync}>
          {t('shareTheme.retry')}
        </Button>
      )}
    </div>
  );
};
