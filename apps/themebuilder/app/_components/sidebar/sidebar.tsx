import { Button, Dialog, Heading, Tabs } from '@digdir/designsystemet-react';
import { useMediaQuery } from '@internal/components';
import { CogIcon } from '@navikt/aksel-icons';
import cl from 'clsx/lite';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BorderRadiusInput } from '../border-radius-input/border-radius-input';
import { ConfigPaste } from '../config-paste/config-paste';
import { TokenModal } from '../token-modal/token-modal';
import { ColorPage } from './color-page/color-page';
import classes from './sidebar.module.css';

export const Sidebar = () => {
  const { t } = useTranslation();
  const configPasteDialogRef = useRef<HTMLDialogElement>(null);

  const [activePage, setActivePage] = useState<'colors' | 'dimensions'>(
    'colors',
  );

  const isMobile = useMediaQuery('(max-width: 768px)');
  const [modalOpen, setModalOpen] = useState(false);

  const [isSticky, setSticky] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const shouldBeSticky = window.scrollY > 135;
      if (isSticky !== shouldBeSticky) {
        setSticky(shouldBeSticky);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isSticky]);

  return (
    <>
      <div>
        <button
          className={cl(
            classes.toggle,
            showSidebar && classes.toggleOpen,
            'ds-focus-visible',
          )}
          onClick={() => {
            !isMobile && setShowSidebar(!showSidebar);
            isMobile && setModalOpen(true);
          }}
          aria-label='Toggle sidebar'
          aria-expanded={showSidebar}
        >
          <CogIcon aria-hidden height='1.5rem' width='auto' />
        </button>
        <div
          className={cl(
            classes.sidebar,
            isSticky && classes.sticky,
            showSidebar && classes.showSidebar,
          )}
        >
          <Tabs
            value={activePage}
            onChange={(value) =>
              setActivePage(value as 'colors' | 'dimensions')
            }
          >
            <Tabs.List>
              <Tabs.Tab value='colors'>{t('tabs.colors')}</Tabs.Tab>
              <Tabs.Tab value='dimensions'>{t('tabs.dimensions')}</Tabs.Tab>
            </Tabs.List>
            <div className={classes.tabContent}>
              <Tabs.Panel className={classes.tabPanel} value='colors'>
                <ColorPage />
              </Tabs.Panel>
              <Tabs.Panel className={classes.tabPanel} value='dimensions'>
                <BorderRadiusInput />
              </Tabs.Panel>
            </div>
          </Tabs>

          <div className={classes.bottom} data-size='sm'>
            <TokenModal />
            <Button
              onClick={() => configPasteDialogRef.current?.showModal()}
              className={classes.configButton}
              variant='secondary'
            >
              {t('configPaste.import-config')}
            </Button>
          </div>
        </div>
      </div>
      {isMobile && (
        <Dialog
          open={modalOpen}
          className={classes.modal}
          onClose={() => setModalOpen(false)}
        >
          <Dialog.Block>
            <Heading>{t('themeBuilder.title')}</Heading>
          </Dialog.Block>
          <Dialog.Block className={classes.tabsWrapper}>
            <Tabs
              value={activePage}
              onChange={(value) =>
                setActivePage(value as 'colors' | 'dimensions')
              }
            >
              <Tabs.List>
                <Tabs.Tab value='colors'>{t('tabs.colors')}</Tabs.Tab>
                <Tabs.Tab value='dimensions'>{t('tabs.dimensions')}</Tabs.Tab>
              </Tabs.List>
              <Tabs.Panel className={classes.tabPanel} value='colors'>
                <ColorPage />
              </Tabs.Panel>
              <Tabs.Panel className={classes.tabPanel} value='dimensions'>
                <BorderRadiusInput />
              </Tabs.Panel>
            </Tabs>
            <div className={classes.modalBottom}>
              <TokenModal />
              <Button
                onClick={() => configPasteDialogRef.current?.showModal()}
                className={classes.configButton}
                variant='secondary'
              >
                {t('configPaste.import-config')}
              </Button>
            </div>
          </Dialog.Block>
        </Dialog>
      )}
      <Dialog
        ref={configPasteDialogRef}
        closedby='any'
        className={classes.configDialog}
      >
        <Dialog.Block>
          <Heading level={2}>{t('configPaste.import-config')}</Heading>
        </Dialog.Block>
        <Dialog.Block>
          <ConfigPaste />
        </Dialog.Block>
      </Dialog>
    </>
  );
};
