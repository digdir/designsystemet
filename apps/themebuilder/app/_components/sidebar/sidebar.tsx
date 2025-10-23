import { Dialog, Heading, Tabs } from '@digdir/designsystemet-react';
import { useMediaQuery } from '@internal/components';
import { CogIcon } from '@navikt/aksel-icons';
import cl from 'clsx/lite';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BorderRadiusInput } from '../border-radius-input/border-radius-input';
import { TokenModal } from '../token-modal/token-modal';
import { ColorOverrides } from './color-overrides/color-overrides';
import { ColorPage } from './color-page/color-page';
import classes from './sidebar.module.css';

export const Sidebar = () => {
  const { t } = useTranslation();
  const [activePage, setActivePage] = useState<
    'colors' | 'dimensions' | 'overrides'
  >('colors');

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
          <CogIcon aria-hidden fontSize='1.5rem' />
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
              setActivePage(value as 'colors' | 'dimensions' | 'overrides')
            }
          >
            <Tabs.List>
              <Tabs.Tab value='colors'>{t('tabs.colors')}</Tabs.Tab>
              <Tabs.Tab value='dimensions'>{t('tabs.dimensions')}</Tabs.Tab>
              <Tabs.Tab value='overrides'>Overrides</Tabs.Tab>
            </Tabs.List>
            <div className={classes.tabContent}>
              <Tabs.Panel className={classes.tabPanel} value='colors'>
                <ColorPage />
              </Tabs.Panel>
              <Tabs.Panel className={classes.tabPanel} value='dimensions'>
                <BorderRadiusInput />
              </Tabs.Panel>
              <Tabs.Panel className={classes.tabPanel} value='overrides'>
                <ColorOverrides />
              </Tabs.Panel>
            </div>
          </Tabs>

          <div className={classes.bottom} data-size='sm'>
            <div>
              <TokenModal />
            </div>
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
                setActivePage(value as 'colors' | 'dimensions' | 'overrides')
              }
            >
              <Tabs.List>
                <Tabs.Tab value='colors'>{t('tabs.colors')}</Tabs.Tab>
                <Tabs.Tab value='dimensions'>{t('tabs.dimensions')}</Tabs.Tab>
                <Tabs.Tab value='overrides'>Overrides</Tabs.Tab>
              </Tabs.List>
              <Tabs.Panel className={classes.tabPanel} value='colors'>
                <ColorPage />
              </Tabs.Panel>
              <Tabs.Panel className={classes.tabPanel} value='dimensions'>
                <BorderRadiusInput />
              </Tabs.Panel>
              <Tabs.Panel className={classes.tabPanel} value='overrides'>
                <ColorOverrides />
              </Tabs.Panel>
            </Tabs>
            <div className={classes.modalBottom}>
              <TokenModal />
            </div>
          </Dialog.Block>
        </Dialog>
      )}
    </>
  );
};
