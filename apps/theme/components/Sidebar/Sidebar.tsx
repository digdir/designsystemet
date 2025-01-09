import cl from 'clsx/lite';
import { useEffect, useState } from 'react';

import { useThemeStore } from '../../store';

import { CogIcon } from '@navikt/aksel-icons';
import { BorderRadiusInput } from '../BorderRadiusInput/BorderRadiusInput';
import { TokenModal } from '../TokenModal/TokenModal';
import { ColorPage } from './ColorPage/ColorPage';

import classes from './Sidebar.module.css';

export const Sidebar = () => {
  const setAppearance = useThemeStore((state) => state.setAppearance);
  const [isSticky, setSticky] = useState(false);
  const [size, setSize] = useState('sm');
  const [showSidebar, setShowSidebar] = useState(false);
  const activePage = useThemeStore((state) => state.activePage);
  const setActivePage = useThemeStore((state) => state.setActivePage);

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
        className={cl(classes.toggle, showSidebar && classes.toggleOpen)}
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
        <div className={classes.scrollContainer}>
          {activePage === 'colors' && (
            <ColorPage onNextClick={() => setActivePage('radius')} />
          )}
          {activePage === 'radius' && <BorderRadiusInput />}

          <div className={classes.bottom}>
            <TokenModal />
          </div>
        </div>
      </div>
    </div>
  );
};
