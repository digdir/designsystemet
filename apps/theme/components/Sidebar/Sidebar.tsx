import cl from 'clsx/lite';
import { useEffect, useState } from 'react';

import { useThemeStore } from '../../store';

import {
  Button,
  Dialog,
  Heading,
  Tabs,
  useMediaQuery,
} from '@digdir/designsystemet-react';
import { CogIcon } from '@navikt/aksel-icons';
import { BorderRadiusInput } from '../BorderRadiusInput/BorderRadiusInput';
import { TokenModal } from '../TokenModal/TokenModal';
import { ColorPage } from './ColorPage/ColorPage';
import { LightnessPage } from './LightnessPage/LightnessPage';
import classes from './Sidebar.module.css';

export const Sidebar = () => {
  const activePage = useThemeStore((state) => state.activePage);
  const setActivePage = useThemeStore((state) => state.setActivePage);

  const isMobile = useMediaQuery('(max-width: 768px)');
  const [modalOpen, setModalOpen] = useState(false);

  const [isSticky, setSticky] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [showLightnessPage, setShowLightnessPage] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      setSticky(window.scrollY > 135);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

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
        >
          <CogIcon title='tannhjul' fontSize='1.5rem' />
        </button>
        <div
          className={cl(
            classes.sidebar,
            isSticky && classes.sticky,
            showSidebar && classes.showSidebar,
          )}
        >
          {/* <Tabs
            value={activePage}
            onChange={(value) =>
              setActivePage(value as 'colors' | 'dimensions')
            }
          >
            <Tabs.List>
              <Tabs.Tab value='colors'>Farger</Tabs.Tab>
              <Tabs.Tab value='dimensions'>Dimensjoner</Tabs.Tab>
            </Tabs.List>
            <div className={classes.tabContent}>
              <Tabs.Panel className={classes.tabPanel} value='colors'>
                <ColorPage />
              </Tabs.Panel>
              <Tabs.Panel className={classes.tabPanel} value='dimensions'>
                <BorderRadiusInput />
              </Tabs.Panel>
            </div>
          </Tabs> */}

          {showLightnessPage && (
            <LightnessPage onBackClicked={() => setShowLightnessPage(false)} />
          )}
          {!showLightnessPage && (
            <>
              <ColorPage />
              <Button
                className={classes.lightBtn}
                variant='tertiary'
                data-size='sm'
                onClick={() => setShowLightnessPage(true)}
                data-color='neutral'
              >
                <CogIcon title='tannhjul' fontSize='1.5rem' />
                Overstyr lightness verdier
              </Button>
            </>
          )}

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
            <Heading>Tema</Heading>
          </Dialog.Block>
          <Dialog.Block className={classes.tabsWrapper}>
            <Tabs
              value={activePage}
              onChange={(value) =>
                setActivePage(value as 'colors' | 'dimensions')
              }
            >
              <Tabs.List>
                <Tabs.Tab value='colors'>Farger</Tabs.Tab>
                <Tabs.Tab value='dimensions'>Dimensjoner</Tabs.Tab>
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
            </div>
          </Dialog.Block>
        </Dialog>
      )}
    </>
  );
};
