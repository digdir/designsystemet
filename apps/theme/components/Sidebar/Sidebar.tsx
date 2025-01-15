import cl from 'clsx/lite';
import { useEffect, useState } from 'react';

import { useThemeStore } from '../../store';

import { Heading, Tabs } from '@digdir/designsystemet-react';
import { CogIcon } from '@navikt/aksel-icons';
import { AppearanceToggle } from '../AppearanceToggle/AppearanceToggle';
import { BorderRadiusInput } from '../BorderRadiusInput/BorderRadiusInput';
import { TokenModal } from '../TokenModal/TokenModal';
import { ColorPage } from './ColorPage/ColorPage';
import classes from './Sidebar.module.css';

export const Sidebar = () => {
  const activePage = useThemeStore((state) => state.activePage);
  const setActivePage = useThemeStore((state) => state.setActivePage);

  const [isSticky, setSticky] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);

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
    <div>
      <button
        className={cl(
          classes.toggle,
          showSidebar && classes.toggleOpen,
          'ds-focus-visible',
        )}
        onClick={() => setShowSidebar(!showSidebar)}
      >
        <CogIcon title='a11y-title' fontSize='1.5rem' />
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
          onChange={(value) => setActivePage(value as 'colors' | 'dimensions')}
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
        </Tabs>

        <div className={classes.bottom}>
          <div className={classes.appearance}>
            <Heading level={4} data-size='xs'>
              Visning
            </Heading>
            <AppearanceToggle />
          </div>
          <TokenModal />
        </div>
      </div>
    </div>
  );
};
