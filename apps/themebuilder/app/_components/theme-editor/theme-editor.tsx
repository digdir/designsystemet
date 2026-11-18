import { Dialog, Heading, Tabs } from '@digdir/designsystemet-react';
import { useMediaQuery } from '@internal/components';
import { CogIcon } from '@navikt/aksel-icons';
import cl from 'clsx/lite';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useThemeStore } from '~/model/theme-store';
import { BorderRadiusSettings } from '../border-radius-settings/border-radius-settings';
import { ExportThemeDialog } from '../export-theme-dialog/export-theme-dialog';
import { ImportConfigDialog } from '../import-config-dialog/import-config-dialog';
import { ColorSettings } from './color-settings/color-settings';
import classes from './theme-editor.module.css';

/** How far the page is scrolled before the editor sticks to the top of the window */
const STICKY_SCROLL_Y = 135;

/**
 * The theme editor. It is a panel next to the page on wide screens, a panel that is opened with a button on
 * medium screens, and a dialog opened with the same button on small screens.
 */
export const ThemeEditor = () => {
  const { t } = useTranslation();
  const { workspace, revision } = useThemeStore();
  /* The editors start over for another theme, and when the config is replaced */
  const editorKey = `${revision} ${workspace.activeTheme}`;
  const [activeTab, setActiveTab] = useState('colors');
  /* The first render is the same on the server and in the browser; the dialog replaces the panel right after on small screens */
  const isMobile = useMediaQuery('(max-width: 768px)', {
    initializeWithValue: false,
  });
  /* Whether the panel is opened with the button, on medium screens. On wide screens it is always shown. */
  const [panelOpen, setPanelOpen] = useState(false);
  /* Whether the dialog is open, on small screens. It is kept apart from the panel, so that a window
   * that becomes small with the panel open does not get a dialog on top of the page. */
  const [dialogOpen, setDialogOpen] = useState(false);
  if (!isMobile && dialogOpen) setDialogOpen(false);
  const open = isMobile ? dialogOpen : panelOpen;
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
        <Tabs.Tab value='colors'>{t('editorTabs.colors')}</Tabs.Tab>
        <Tabs.Tab value='dimensions'>{t('editorTabs.dimensions')}</Tabs.Tab>
      </Tabs.List>
      <div className={classes.tabContent}>
        <Tabs.Panel className={classes.tabPanel} value='colors'>
          <ColorSettings key={editorKey} />
        </Tabs.Panel>
        <Tabs.Panel className={classes.tabPanel} value='dimensions'>
          <BorderRadiusSettings key={editorKey} />
        </Tabs.Panel>
      </div>
    </Tabs>
  );
  const actions = (
    <>
      <ExportThemeDialog />
      <ImportConfigDialog />
    </>
  );

  return (
    <div>
      <button
        type='button'
        className={cl(
          classes.toggle,
          panelOpen && !isMobile && classes.toggleOpen,
          'ds-focus-visible',
        )}
        onClick={() =>
          isMobile ? setDialogOpen(true) : setPanelOpen(!panelOpen)
        }
        aria-label={t('themeBuilder.toggle-editor')}
        aria-expanded={open}
      >
        <CogIcon aria-hidden height='1.5rem' width='1.5rem' />
      </button>
      {isMobile ? (
        <Dialog
          open={dialogOpen}
          className={classes.mobileDialog}
          onClose={() => setDialogOpen(false)}
        >
          <Dialog.Block>
            <Heading>{t('themeBuilder.title')}</Heading>
          </Dialog.Block>
          <Dialog.Block className={classes.tabsWrapper}>
            {tabs}
            <div className={classes.mobileActions}>{actions}</div>
          </Dialog.Block>
        </Dialog>
      ) : (
        <div
          className={cl(
            classes.panel,
            isSticky && classes.sticky,
            panelOpen && classes.opened,
          )}
        >
          {tabs}
          <div className={classes.actions} data-size='sm'>
            {actions}
          </div>
        </div>
      )}
    </div>
  );
};
