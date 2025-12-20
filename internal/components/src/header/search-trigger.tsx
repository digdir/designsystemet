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

  const isMac =
    typeof navigator !== 'undefined' &&
    navigator.platform.toUpperCase().indexOf('MAC') >= 0;

  return (
    <Button
      type='button'
      className={classes.trigger}
      onClick={onClick}
      aria-label={t('header.search')}
      data-color='neutral'
      variant='tertiary'
    >
      <MagnifyingGlassIcon
        className={classes.triggerIcon}
        aria-hidden='true'
        fontSize='1.5em'
      />
      <span className={classes.triggerText}>{t('header.search')}</span>
    </Button>
  );
}
