import { Dialog, Heading, Tabs } from '@digdir/designsystemet-react';
import { useMediaQuery } from '@internal/components';
import { CogIcon } from '@navikt/aksel-icons';
import cl from 'clsx/lite';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useThemeStore } from '~/model/theme-store';
import { BorderRadiusInput } from '../border-radius-input/border-radius-input';
import { ConfigPaste } from '../config-paste/config-paste';
import { ExportThemeModal } from '../export-theme-modal/export-theme-modal';
import { ColorPage } from './color-page/color-page';
import classes from './sidebar.module.css';

/** How far the page is scrolled before the editor sticks to the top of the window */
const STICKY_SCROLL_Y = 135;

/**
 * The theme editor. It is a panel next to the page on wide screens, a panel that is opened with a button on
 * medium screens, and a dialog opened with the same button on small screens.
 */
export const Sidebar = () => {
  const { t } = useTranslation();
  const { workspace } = useThemeStore();
  const [activeTab, setActiveTab] = useState('colors');
  const isMobile = useMediaQuery('(max-width: 768px)');
  /* Whether the editor is opened with the button. On wide screens it is always shown. */
  const [open, setOpen] = useState(false);
  const [isSticky, setSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => setSticky(window.scrollY > STICKY_SCROLL_Y);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  /* The editor is rendered once, so that there is one of each field, dialog and editing state */
  const tabs = (
    <Tabs value={activeTab} onChange={setActiveTab}>
      <Tabs.List>
        <Tabs.Tab value='colors'>{t('tabs.colors')}</Tabs.Tab>
        <Tabs.Tab value='dimensions'>{t('tabs.dimensions')}</Tabs.Tab>
      </Tabs.List>
      <div className={classes.tabContent}>
        <Tabs.Panel className={classes.tabPanel} value='colors'>
          <ColorPage key={workspace.activeTheme} />
        </Tabs.Panel>
        <Tabs.Panel className={classes.tabPanel} value='dimensions'>
          <BorderRadiusInput key={workspace.activeTheme} />
        </Tabs.Panel>
      </div>
    </Tabs>
  );
  const actions = (
    <>
      <ExportThemeModal />
      <ConfigPaste />
    </>
  );

  return (
    <div>
      <button
        type='button'
        className={cl(
          classes.toggle,
          open && !isMobile && classes.toggleOpen,
          'ds-focus-visible',
        )}
        onClick={() => setOpen(isMobile || !open)}
        aria-label={t('themeBuilder.toggle-editor')}
        aria-expanded={open}
      >
        <CogIcon aria-hidden height='1.5rem' width='1.5rem' />
      </button>
      {isMobile ? (
        <Dialog
          open={open}
          className={classes.modal}
          onClose={() => setOpen(false)}
        >
          <Dialog.Block>
            <Heading>{t('themeBuilder.title')}</Heading>
          </Dialog.Block>
          <Dialog.Block className={classes.tabsWrapper}>
            {tabs}
            <div className={classes.modalBottom}>{actions}</div>
          </Dialog.Block>
        </Dialog>
      ) : (
        <div
          className={cl(
            classes.sidebar,
            isSticky && classes.sticky,
            open && classes.showSidebar,
          )}
        >
          {tabs}
          <div className={classes.bottom} data-size='sm'>
            {actions}
          </div>
        </div>
      )}
    </div>
  );
};
