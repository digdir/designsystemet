import { Button } from '@digdir/designsystemet-react';
import { MagnifyingGlassIcon } from '@navikt/aksel-icons';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import classes from './search-trigger.module.css';

type SearchTriggerProps = {
  onClick: () => void;
};

export function SearchTrigger({ onClick }: SearchTriggerProps) {
  const { t } = useTranslation();

  // Global keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: globalThis.KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        onClick();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClick]);

  return (
    <Button
      type='button'
      onClick={onClick}
      aria-label={t('header.search')}
      data-color='neutral'
      variant='secondary'
      className={classes.triggerButton}
    >
      <MagnifyingGlassIcon aria-hidden='true' />
      <span className={classes.triggerText}>{t('header.search')}</span>
    </Button>
  );
}
