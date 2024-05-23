'use client';

import type { SetStateAction } from 'react';
import { useEffect, useState } from 'react';
import type { CssColor } from '@adobe/leonardo-contrast-colors';
import { ChevronDownIcon } from '@navikt/aksel-icons';
import cn from 'classnames';
import { Modal, NativeSelect } from '@digdir/designsystemet-react';

import { mapTokens } from '@/utils/tokenMapping';
import { canTextBeUsedOnColors, generateColorTheme } from '@/utils/themeUtils';

import { areColorsContrasting } from '@/utils/ColorUtils';

import { Container } from './components/Container/Container';
import { Landing } from './components/Previews/Landing/Landing';
import { Dashboard } from './components/Previews/Dashboard/Dashboard';
import { Components } from './components/Previews/Components/Components';
import { ColorPicker } from './components/ColorPicker/ColorPicker';
import { Scale } from './components/Scale/Scale';
import { Header } from './components/Header/Header';
import classes from './page.module.css';
import { TokenModal } from './components/TokenModal/TokenModal';

type previewModeType =
  | 'dashboard'
  | 'landing'
  | 'forms'
  | 'auth'
  | 'components';

type themeType = {
  light: CssColor[];
  dark: CssColor[];
  contrast: CssColor[];
};

type colorErrorType = 'none' | 'decorative' | 'interaction';

export default function Home() {
  const [accentColor, setAccentColor] = useState<CssColor>('#0062BA');
  const [accentError, setAccentError] = useState<colorErrorType>('none');
  const [accentTheme, setAccentTheme] = useState<themeType>({
    light: [],
    dark: [],
    contrast: [],
  });

  const [neutralColor, setNeutralColor] = useState<CssColor>('#1E2B3C');
  const [neutralError, setNeutralError] = useState<colorErrorType>('none');
  const [neutralTheme, setNeutralTheme] = useState<themeType>({
    light: [],
    dark: [],
    contrast: [],
  });
  const [brandOneColor, setBrandOneColor] = useState<CssColor>('#F45F63');
  const [brandOneError, setBrandOneError] = useState<colorErrorType>('none');
  const [brandOneTheme, setBrandOneTheme] = useState<themeType>({
    light: [],
    dark: [],
    contrast: [],
  });
  const [brandTwoColor, setBrandTwoColor] = useState<CssColor>('#E5AA20');
  const [brandTwoError, setBrandTwoError] = useState<colorErrorType>('none');
  const [brandTwoTheme, setBrandTwoTheme] = useState<themeType>({
    light: [],
    dark: [],
    contrast: [],
  });
  const [brandThreeColor, setBrandThreeColor] = useState<CssColor>('#1E98F5');
  const [brandThreeError, setBrandThreeError] =
    useState<colorErrorType>('none');
  const [brandThreeTheme, setBrandThreeTheme] = useState<themeType>({
    light: [],
    dark: [],
    contrast: [],
  });
  const [themeMode, setThemeMode] = useState<'light' | 'dark' | 'contrast'>(
    'light',
  );
  const [previewMode, setPreviewMode] = useState<previewModeType>('components');
  const [contrastMode, setContrastMode] = useState<'aa' | 'aaa'>('aa');

  useEffect(() => {
    mapTokens();
    updateColor(
      accentColor,
      contrastMode,
      setAccentColor,
      setAccentTheme,
      setAccentError,
    );
    updateColor(
      neutralColor,
      contrastMode,
      setNeutralColor,
      setNeutralTheme,
      setNeutralError,
    );
    updateColor(
      brandOneColor,
      contrastMode,
      setBrandOneColor,
      setBrandOneTheme,
      setBrandOneError,
    );
    updateColor(
      brandTwoColor,
      contrastMode,
      setBrandTwoColor,
      setBrandTwoTheme,
      setBrandTwoError,
    );
    updateColor(
      brandThreeColor,
      contrastMode,
      setBrandThreeColor,
      setBrandThreeTheme,
      setBrandThreeError,
    );
  }, [contrastMode]);

  // Sticky Menu Area
  useEffect(() => {
    window.addEventListener('scroll', isSticky);
    return () => {
      window.removeEventListener('scroll', isSticky);
    };
  });

  const isSticky = () => {
    const header = document.querySelector('.pickers');
    const scrollTop = window.scrollY;
    if (header) {
      scrollTop >= 250
        ? header.classList.add('is-sticky')
        : header.classList.remove('is-sticky');
    }
  };

  const updateColor = (
    color: CssColor,
    contrastMode: 'aa' | 'aaa',
    colorSetter: React.Dispatch<React.SetStateAction<CssColor>>,
    colorThemeSetter: React.Dispatch<React.SetStateAction<themeType>>,
    colorErrorSetter: React.Dispatch<React.SetStateAction<colorErrorType>>,
  ) => {
    const scale = generateColorTheme(color as CssColor, contrastMode);
    colorSetter(color as SetStateAction<CssColor>);
    colorThemeSetter(scale);
    colorErrorSetter(getColorError(scale.light));
  };

  const getColorError = (scale: CssColor[]) => {
    const contrast = areColorsContrasting(
      scale[8] as CssColor,
      '#ffffff',
      'decorative',
    );
    const textCanBeUsed = canTextBeUsedOnColors(scale[8], scale[10]);

    if (!contrast && textCanBeUsed) {
      return 'decorative';
    } else if (contrast && !textCanBeUsed) {
      return 'interaction';
    }

    return 'none';
  };

  return (
    <div>
      <Header />
      <main className={classes.main}>
        <Container>
          <div>
            <h1 className={classes.title}>Sett opp fargetema</h1>
          </div>
          <div className={classes.pickersContainer}>
            <div className={cn(classes.pickers, 'pickers')}>
              <ColorPicker
                colorError={accentError}
                label='Accent'
                defaultColor='#0062BA'
                onColorChanged={(color) => {
                  updateColor(
                    color,
                    contrastMode,
                    setAccentColor,
                    setAccentTheme,
                    setAccentError,
                  );
                }}
              />
              <ColorPicker
                colorError={neutralError}
                label='Neutral'
                defaultColor='#1E2B3C'
                onColorChanged={(color) => {
                  updateColor(
                    color,
                    contrastMode,
                    setNeutralColor,
                    setNeutralTheme,
                    setNeutralError,
                  );
                }}
              />
              <ColorPicker
                colorError={brandOneError}
                label='Brand 1'
                defaultColor='#F45F63'
                onColorChanged={(color) => {
                  updateColor(
                    color,
                    contrastMode,
                    setBrandOneColor,
                    setBrandOneTheme,
                    setBrandOneError,
                  );
                }}
              />
              <ColorPicker
                colorError={brandTwoError}
                label='Brand 2'
                defaultColor='#E5AA20'
                onColorChanged={(color) => {
                  updateColor(
                    color,
                    contrastMode,
                    setBrandTwoColor,
                    setBrandTwoTheme,
                    setBrandTwoError,
                  );
                }}
              />
              <ColorPicker
                colorError={brandThreeError}
                label='Brand 3'
                defaultColor='#1E98F5'
                onColorChanged={(color) => {
                  updateColor(
                    color,
                    contrastMode,
                    setBrandThreeColor,
                    setBrandThreeTheme,
                    setBrandThreeError,
                  );
                }}
              />
              <div className={classes.dropdown}>
                <NativeSelect
                  label='Kontrastnivå'
                  size='medium'
                  className={classes.contrastSelect}
                  value={contrastMode}
                  onChange={(e) => {
                    setContrastMode(e.target.value as 'aa' | 'aaa');
                  }}
                >
                  <option value='aa'>AA</option>
                  <option value='aaa'>AAA</option>
                </NativeSelect>
              </div>
              <div className={classes.dropdown}>
                <TokenModal
                  accentColor={accentColor}
                  neutralColor={neutralColor}
                  brand1Color={brandOneColor}
                  brand2Color={brandTwoColor}
                  brand3Color={brandThreeColor}
                />
              </div>
            </div>
          </div>
          <div className={classes.rows}>
            <div className={classes.row}>
              <div className={classes.scaleLabel}>Accent</div>
              <Scale
                colorScale={accentTheme[themeMode]}
                showHeader
                showColorMeta={false}
                themeMode={themeMode}
                type='accent'
              />
            </div>
            <div className={classes.row}>
              <div className={classes.scaleLabel}>Neutral</div>
              <Scale
                colorScale={neutralTheme[themeMode]}
                showColorMeta={false}
                themeMode={themeMode}
                type='grey'
              />
            </div>

            <div className={cn(classes.row, classes.brandRow)}>
              <div className={classes.scaleLabel}>Brand 1</div>
              <Scale
                colorScale={brandOneTheme[themeMode]}
                showColorMeta={false}
                themeMode={themeMode}
                type='brandOne'
              />
            </div>
            <div className={classes.row}>
              <div className={classes.scaleLabel}>Brand 2</div>
              <Scale
                colorScale={brandTwoTheme[themeMode]}
                showColorMeta={false}
                themeMode={themeMode}
                type='brandTwo'
              />
            </div>

            <div className={classes.row}>
              <div className={classes.scaleLabel}>Brand 3</div>
              <Scale
                colorScale={brandThreeTheme[themeMode]}
                showColorMeta={false}
                themeMode={themeMode}
                type='brandThree'
              />
            </div>
          </div>

          <div className={classes.toolbar}>
            <div className={classes.menu}>
              <button
                className={cn(classes.menuItem, {
                  [classes.menuItemActive]: previewMode === 'components',
                })}
                onClick={() => setPreviewMode('components')}
              >
                Komponenter
              </button>
              <button
                className={cn(classes.menuItem, {
                  [classes.menuItemActive]: previewMode === 'dashboard',
                })}
                onClick={() => setPreviewMode('dashboard')}
              >
                Dashboard
              </button>
              <button
                className={cn(
                  classes.menuItem,
                  {
                    [classes.menuItemActive]: previewMode === 'landing',
                  },
                  classes.menuItemDisabled,
                )}
              >
                Landingsside
              </button>
              <button
                className={cn(
                  classes.menuItem,
                  {
                    [classes.menuItemActive]: previewMode === 'forms',
                  },
                  classes.menuItemDisabled,
                )}
              >
                Skjemaer
              </button>
              <button
                className={cn(
                  classes.menuItem,
                  {
                    [classes.menuItemActive]: previewMode === 'auth',
                  },
                  classes.menuItemDisabled,
                )}
              >
                Autentisering
              </button>
            </div>
            <div className={classes.toggles}>
              <button
                className={cn(classes.toggle, {
                  [classes.active]: themeMode === 'light',
                })}
                onClick={() => setThemeMode('light')}
              >
                <img
                  src='img/light-dot.svg'
                  alt=''
                />
                Lys
              </button>
              <button
                className={cn(classes.toggle, {
                  [classes.active]: themeMode === 'dark',
                })}
                onClick={() => setThemeMode('dark')}
              >
                <img
                  src='img/dark-dot.svg'
                  alt=''
                />
                Mørk
              </button>
              <button
                className={cn(classes.toggle, {
                  [classes.active]: themeMode === 'contrast',
                })}
                onClick={() => setThemeMode('contrast')}
              >
                <img
                  src='img/contrast-dot.svg'
                  alt=''
                />
                Kontrast
              </button>
            </div>
          </div>

          <div
            className={cn(
              classes.preview,
              classes[themeMode as keyof typeof classes],
            )}
            id='preview'
          >
            {previewMode === 'components' && <Components />}
            {previewMode === 'dashboard' && <Dashboard />}
            {previewMode === 'landing' && <Landing />}
          </div>
        </Container>
      </main>
    </div>
  );
}
