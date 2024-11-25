import cl from 'clsx/lite';
import { useEffect, useState } from 'react';

import { useThemeStore } from '../../store';

import { CogIcon } from '@navikt/aksel-icons';
import { ColorPage } from './ColorPage/ColorPage';
import { FinishPage } from './FinishPage/FinishPage';
import { IntroPage } from './IntroPage/IntroPage';
import { RadiusPage } from './RadiusPage/RadiusPage';
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
          {activePage === 'intro' && (
            <IntroPage onNextClick={() => setActivePage('color')} />
          )}
          {activePage === 'color' && (
            <ColorPage onNextClick={() => setActivePage('radius')} />
          )}
          {activePage === 'radius' && (
            <RadiusPage onPrevClick={() => setActivePage('color')} />
          )}

          {activePage === 'finish' && (
            <FinishPage onPrevClick={() => setActivePage('radius')} />
          )}

          {/* APPEARANCE */}
          {/* <div className={classes.themeMode}>
          <div className={classes.group}>
            <div className={classes.label}>Visning</div>
            <Toggle
              type='appearance'
              items={[
                { name: 'Lys', type: 'sm', value: 'light' },
                { name: 'Mørk', type: 'sm', value: 'dark' },
                { name: 'Kontrast', type: 'sm', value: 'contrast' },
              ]}
              onChange={(value) => {
                const val = value;
                setAppearance(val as ColorMode);
              }}
            />
          </div>
        </div> */}

          {/* SIZES */}
          {/* <div className={classes.group}>
          <div className={classes.groupHeader}>
            <Heading data-size='2xs'>Komponentstørrelser</Heading>
          </div>
          <div className={classes.sizes}>
            <SizeInput
              onChange={(size) => setSize(size)}
              name='xSmall'
              size='14px'
            />
            <SizeInput
              onChange={(size) => setSize(size)}
              name='Small'
              size='16px'
            />
            <SizeInput
              onChange={(size) => setSize(size)}
              name='Medium'
              size='18px'
            />
            <SizeInput
              onChange={(size) => setSize(size)}
              name='Large'
              size='21px'
            />
          </div>
        </div> */}
        </div>
      </div>
    </div>
  );
};
