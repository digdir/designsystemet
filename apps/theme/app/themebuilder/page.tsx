'use client';

import type { ColorScheme } from '@digdir/designsystemet';
import { Heading } from '@digdir/designsystemet-react';

import { useRouter } from 'next/navigation';
import {
  BorderRadius,
  ColorContrasts,
  ColorPreview,
  ColorTokens,
  Colors,
  Header,
  Sidebar,
  ToggleChip,
} from '../../components';
import { Toggle } from '../../components/Toggle/Toggle';
import { useThemeStore } from '../../store';
import { useThemeParams } from './_utils/useThemeParams';
import classes from './page.module.css';

export default function Home() {
  const setActivePage = useThemeStore((state) => state.setActivePage);
  const router = useRouter();
  const activePage = useThemeStore((state) => state.activePage);
  const setAppearance = useThemeStore((state) => state.setAppearance);
  const items = [
    {
      name: 'Farger',
      value: 'colors',
    },
    {
      name: 'Border radius',
      value: 'radius',
    },
  ];

  /* For theme params */
  useThemeParams();

  return (
    <div className={classes.page} id='preview'>
      <Header />
      <div className={classes.container}>
        <div className={classes.content}>
          <div className={classes.top}>
            <ToggleChip
              defaultValue={activePage}
              items={items}
              onChange={(e) => {
                console.log(e);
                if (e === 'intro') {
                  router.push('/welcome');
                } else {
                  setActivePage(e as 'colors' | 'radius' | 'intro');
                }
              }}
            />

            <div className={classes.themeMode}>
              <div className={classes.group}>
                <div className={classes.label}>Visning</div>
                <Toggle
                  type='appearance'
                  items={[
                    { name: 'Lys', type: 'sm', value: 'light' },
                    { name: 'Mørk', type: 'sm', value: 'dark' },
                  ]}
                  onChange={(value) => {
                    const val = value;
                    setAppearance(val as ColorScheme);
                  }}
                />
              </div>
            </div>
          </div>

          {(activePage === 'intro' || activePage === 'colors') && (
            <>
              <Heading data-size='sm'>Farger</Heading>
              <div className={classes.panelToggle}>
                <div>
                  <div className={classes.colorsContainer}>
                    <Colors />
                  </div>
                </div>

                <div>
                  <div className={classes.panel}>
                    <ColorPreview />
                  </div>
                  <div className={classes.panel}>
                    <ColorTokens />
                  </div>
                </div>

                <div>
                  <div className={classes.panel}>
                    <ColorContrasts />
                  </div>
                </div>
              </div>
            </>
          )}

          {activePage === 'radius' && (
            <>
              <Heading className={classes.title} data-size='sm'>
                Border radius
              </Heading>
              <div className={classes.panel}>
                <BorderRadius />
              </div>
            </>
          )}
        </div>
        <div className={classes.sideBarContainer}>
          <Sidebar />
        </div>
      </div>
    </div>
  );
}
