'use client';

import type { ColorMode } from '@/packages/cli/dist/src/colors';
import { Heading, Link, Tabs } from '@digdir/designsystemet-react';
import { ChevronLeftIcon } from '@navikt/aksel-icons';
import NextLink from 'next/link';
import { useRouter } from 'next/navigation';
import {
  BorderRadius,
  ColorContrasts,
  ColorPreview,
  ColorTokens,
  Colors,
  Sidebar,
} from '../../components';
import { Toggle } from '../../components/Toggle/Toggle';
import { useThemeStore } from '../../store';
import classes from './page.module.css';

export default function Home() {
  const colors = useThemeStore((state) => state.colors);
  const addColor = useThemeStore((state) => state.addColor);
  const resetColors = useThemeStore((state) => state.resetColors);
  const appearance = useThemeStore((state) => state.appearance);
  const setActivePage = useThemeStore((state) => state.setActivePage);
  const router = useRouter();
  const activePage = useThemeStore((state) => state.activePage);
  const setAppearance = useThemeStore((state) => state.setAppearance);

  type TestProps = 'light' | 'dark';

  const setHeaderColor = () => {
    let themeMode: TestProps = 'light';
    if (colors.main.length === 0) {
      return '#D9D9D9';
    }
    if (appearance === 'dark') {
      themeMode = 'dark';
    }
    const str = colors.main[0].colors[themeMode][3].hex;
    if (colors.main.length > 1) {
      return (
        'linear-gradient(90deg, ' +
        colors.main[0].colors[themeMode][3].hex +
        ' 0%, ' +
        colors.main[1].colors[themeMode][3].hex +
        ' 60%)'
      );
    }
    return str;
  };

  return (
    <div className={classes.page}>
      <div className={classes.header} style={{ background: setHeaderColor() }}>
        <Link data-size='sm' className={classes.backLink} asChild>
          <NextLink href='/'>
            <ChevronLeftIcon title='a11y-title' fontSize='1.5rem' />
            Gå tilbake til forsiden
          </NextLink>
        </Link>
        <Heading data-size='md'>Temabygger</Heading>
      </div>
      <div className={classes.container}>
        <div className={classes.content}>
          <div className={classes.top}>
            <Tabs
              data-size='sm'
              defaultValue='colors'
              onChange={(e) => {
                if (e === 'intro') {
                  router.push('/welcome');
                } else {
                  setActivePage(e as 'colors' | 'radius' | 'intro');
                }
              }}
            >
              <Tabs.List>
                <Tabs.Tab value='intro'>Navn på tema</Tabs.Tab>
                <Tabs.Tab value='colors'>Farger</Tabs.Tab>
                <Tabs.Tab value='radius'>Border radius</Tabs.Tab>
              </Tabs.List>
            </Tabs>

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
                    setAppearance(val as ColorMode);
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
                    <Colors themeMode='light' />
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
