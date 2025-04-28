'use client';
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
    { name: 'Kontraster', value: 'contrast' },
    { name: 'Typografi', value: 'typography' },
  ];

  return (
    <main className={classes.page} id='main'>
      <ThemeHeader />
      <div className={classes.container}>
        <div className={classes.sideBarContainer}>
          <Sidebar />
        </div>
        <div className={classes.content}>
          <div className={classes.toolbar}>
            {/* Tabs that change between overview and */}
            <div data-size='md' className={classes.tabs}>
              {tabs.map((tab) => (
                <button
                  key={tab.value}
                  data-size='sm'
                  className='ds-focus-visible'
                  onClick={() => setThemeTab(tab.value)}
                  data-active={themeTab === tab.value}
                >
                  {tab.name}
                </button>
              ))}
            </div>
            <AppearanceToggle />
          </div>
          <ThemePages />
        </div>
      </div>
    </main>
  );
}
