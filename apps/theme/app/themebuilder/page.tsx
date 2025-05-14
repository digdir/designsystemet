'use client';
import {
  GlassesIcon,
  PackageIcon,
  PaletteIcon,
  PencilLineIcon,
} from '@navikt/aksel-icons';
import cl from 'clsx/lite';
import { Sidebar, ThemeHeader } from '../../components';
import { AppearanceToggle } from '../../components/AppearanceToggle/AppearanceToggle';
import { useThemeStore } from '../../store';
import { ThemePages } from './_components/ThemePages';
import { useThemeParams } from './_utils/useThemeParams';
import classes from './page.module.css';

export default function Page() {
  /* For theme params */
  useThemeParams();

  const themeTab = useThemeStore((state) => state.themeTab);
  const setThemeTab = useThemeStore((state) => state.setThemeTab);

  const tabs: {
    name: string;
    value: 'overview' | 'colorsystem' | 'contrast' | 'typography' | 'radius';
  }[] = [
    { name: 'Farger', value: 'colorsystem' },
    { name: 'Kontrast', value: 'contrast' },
    { name: 'Eksempler', value: 'overview' },
  ];

  return (
    <main className={classes.page} id='main'>
      <ThemeHeader />
      <div className={classes.container}>
        <div className={classes.content}>
          <div className={classes.toolbar}>
            {/* Tabs that change between overview and */}
            <div data-size='md' className={classes.tabs}>
              {tabs.map((tab, i) => (
                <button
                  key={tab.value}
                  data-size='sm'
                  className={cl(
                    classes.tab,
                    classes[`tab-${i}`], // Unique class based on index
                    'ds-focus-visible',
                  )}
                  onClick={() => setThemeTab(tab.value)}
                  data-active={themeTab === tab.value}
                >
                  <div className={classes.icon}>
                    {i === 0 && (
                      <PaletteIcon title='a11y-title' fontSize='1.6rem' />
                    )}
                    {i === 1 && (
                      <GlassesIcon title='a11y-title' fontSize='1.6rem' />
                    )}
                    {i === 2 && (
                      <PencilLineIcon title='a11y-title' fontSize='1.6rem' />
                    )}
                    {i === 3 && (
                      <PackageIcon title='a11y-title' fontSize='1.6rem' />
                    )}
                  </div>
                  {tab.name}
                </button>
              ))}
            </div>
            <AppearanceToggle />
          </div>
          <ThemePages />
        </div>
        <div className={classes.sideBarContainer}>
          <Sidebar />
        </div>
      </div>
    </main>
  );
}
