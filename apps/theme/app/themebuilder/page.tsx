'use client';

import {
  type ColorMode,
  generateThemeForColor,
} from '@/packages/cli/dist/src/colors';
import { Heading, Link } from '@digdir/designsystemet-react';
import { ChevronLeftIcon } from '@navikt/aksel-icons';
import cl from 'clsx/lite';
import NextLink from 'next/link';
import { useEffect, useState } from 'react';
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

  type ColorTab = 'scales' | 'colors' | 'contrasts';
  const [colorTab, setColorTab] = useState<ColorTab>('scales');

  const activePage = useThemeStore((state) => state.activePage);
  const setAppearance = useThemeStore((state) => state.setAppearance);
  useEffect(() => {
    const dominant = generateThemeForColor('#0062BA');
    const secondary = generateThemeForColor('#159CDE');
    const accent = generateThemeForColor('#F2800E');
    const neutral = generateThemeForColor('#1E2B3C');
    const profile1 = generateThemeForColor('#F45F63');
    const profile2 = generateThemeForColor('#E5AA20');

    addColor({ name: 'dominant', colors: dominant }, 'main');
    addColor({ name: 'secondary', colors: secondary }, 'main');
    addColor({ name: 'accent', colors: accent }, 'main');
    addColor({ name: 'neutral', colors: neutral }, 'neutral');
    addColor({ name: 'profilecolor-1', colors: profile1 }, 'support');
    addColor({ name: 'profilecolor-2', colors: profile2 }, 'support');

    return () => {
      // Set colors to empty array when component unmounts
      resetColors();
    };
  }, []);

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
          {(activePage === 'intro' || activePage === 'color') && (
            <>
              <Heading data-size='sm'>Farger</Heading>
              <div className={classes.panelToggle}>
                <div className={classes.top}>
                  <div className={classes.panelToggleGroup}>
                    <button
                      className={cl(
                        classes.panelToggleBtn,
                        colorTab === 'scales' && classes.active,
                      )}
                      onClick={() => setColorTab('scales')}
                    >
                      Fargerskalaer
                    </button>
                    <button
                      className={cl(
                        classes.panelToggleBtn,
                        colorTab === 'colors' && classes.active,
                      )}
                      onClick={() => setColorTab('colors')}
                    >
                      Se farger i bruk
                    </button>
                    <button
                      className={cl(
                        classes.panelToggleBtn,
                        colorTab === 'contrasts' && classes.active,
                      )}
                      onClick={() => setColorTab('contrasts')}
                    >
                      Se kontraster
                    </button>
                  </div>

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

                <div
                  className={cl(
                    classes.hide,
                    colorTab === 'scales' && classes.show,
                  )}
                >
                  <div className={classes.colorsContainer}>
                    <Colors themeMode='light' />
                  </div>
                </div>

                <div
                  className={cl(
                    classes.hide,
                    colorTab === 'colors' && classes.show,
                  )}
                >
                  <div className={classes.panel}>
                    <ColorPreview />
                  </div>
                  <div className={classes.panel}>
                    <ColorTokens />
                  </div>
                </div>

                <div
                  className={cl(
                    classes.hide,
                    colorTab === 'contrasts' && classes.show,
                  )}
                >
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
