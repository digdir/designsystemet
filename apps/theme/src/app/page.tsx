/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
'use client';

import type { SetStateAction } from 'react';
import { Suspense, useEffect, useState } from 'react';
import type { CssColor } from '@adobe/leonardo-contrast-colors';
import cl from 'clsx/lite';
import { NativeSelect } from '@digdir/designsystemet-react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';

import { mapTokens } from '../utils/tokenMapping';
import type { ColorType } from '../utils/themeUtils';
import { canTextBeUsedOnColors, generateColorTheme } from '../utils/themeUtils';
import { areColorsContrasting, isHexColor } from '../utils/colorUtils';

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
  const defaultAccentColor = '#0062BA';
  const [accentColor, setAccentColor] = useState<CssColor>(defaultAccentColor);
  const [accentError, setAccentError] = useState<colorErrorType>('none');
  const [accentTheme, setAccentTheme] = useState<themeType>({
    light: [],
    dark: [],
    contrast: [],
  });

  const defaultNeutralColor = '#1E2B3C';
  const [neutralColor, setNeutralColor] =
    useState<CssColor>(defaultNeutralColor);
  const [neutralError, setNeutralError] = useState<colorErrorType>('none');
  const [neutralTheme, setNeutralTheme] = useState<themeType>({
    light: [],
    dark: [],
    contrast: [],
  });

  const defaultBrandOneColor = '#F45F63';
  const [brandOneColor, setBrandOneColor] =
    useState<CssColor>(defaultBrandOneColor);
  const [brandOneError, setBrandOneError] = useState<colorErrorType>('none');
  const [brandOneTheme, setBrandOneTheme] = useState<themeType>({
    light: [],
    dark: [],
    contrast: [],
  });

  const defaultBrandTwoColor = '#E5AA20';
  const [brandTwoColor, setBrandTwoColor] =
    useState<CssColor>(defaultBrandTwoColor);
  const [brandTwoError, setBrandTwoError] = useState<colorErrorType>('none');
  const [brandTwoTheme, setBrandTwoTheme] = useState<themeType>({
    light: [],
    dark: [],
    contrast: [],
  });

  const defaultBrandThreeColor = '#1E98F5';
  const [brandThreeColor, setBrandThreeColor] = useState<CssColor>(
    defaultBrandThreeColor,
  );
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
  const searchParams = useSearchParams();
  const { replace } = useRouter();
  const pathname = usePathname();
  const params = new URLSearchParams(searchParams);

  useEffect(() => {
    mapTokens();
    updateColor(
      'accent',
      accentColor,
      contrastMode,
      setAccentColor,
      setAccentTheme,
      setAccentError,
      true,
    );
    updateColor(
      'neutral',
      neutralColor,
      contrastMode,
      setNeutralColor,
      setNeutralTheme,
      setNeutralError,
      true,
    );
    updateColor(
      'brand1',
      brandOneColor,
      contrastMode,
      setBrandOneColor,
      setBrandOneTheme,
      setBrandOneError,
      true,
    );
    updateColor(
      'brand2',
      brandTwoColor,
      contrastMode,
      setBrandTwoColor,
      setBrandTwoTheme,
      setBrandTwoError,
      true,
    );
    updateColor(
      'brand3',
      brandThreeColor,
      contrastMode,
      setBrandThreeColor,
      setBrandThreeTheme,
      setBrandThreeError,
      true,
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
    colorType: ColorType,
    color: CssColor,
    contrastMode: 'aa' | 'aaa',
    colorSetter: React.Dispatch<React.SetStateAction<CssColor>>,
    colorThemeSetter: React.Dispatch<React.SetStateAction<themeType>>,
    colorErrorSetter: React.Dispatch<React.SetStateAction<colorErrorType>>,
    initial = false,
  ) => {
    if (initial) {
      const queryColor = params.get(colorType);
      if (queryColor && isHexColor(queryColor.substring(1))) {
        color = queryColor as CssColor;
      }
    }
    const scale = generateColorTheme(color as CssColor, contrastMode);
    colorSetter(color as SetStateAction<CssColor>);
    colorThemeSetter(scale);
    colorErrorSetter(getColorError(scale.light));
    colorQuerySetter(colorType, color);
  };

  const colorQuerySetter = (colorType: ColorType, color: CssColor) => {
    const defaultColor = {
      accent: defaultAccentColor,
      neutral: defaultNeutralColor,
      brand1: defaultBrandOneColor,
      brand2: defaultBrandTwoColor,
      brand3: defaultBrandThreeColor,
    };

    if (color !== defaultColor[colorType]) {
      params.set(colorType, color);
      replace(`${pathname}?${params.toString()}`);
    }
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
      <Suspense>
        <main className={classes.main}>
          <Container>
            <div>
              <h1 className={classes.title}>Sett opp fargetema</h1>
            </div>
            <div className={classes.pickersContainer}>
              <div className={cl(classes.pickers, 'pickers')}>
                <ColorPicker
                  colorError={accentError}
                  label='Accent'
                  defaultColor={accentColor}
                  onColorChanged={(color) => {
                    updateColor(
                      'accent',
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
                  defaultColor={neutralColor}
                  onColorChanged={(color) => {
                    updateColor(
                      'neutral',
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
                  defaultColor={brandOneColor}
                  onColorChanged={(color) => {
                    updateColor(
                      'brand1',
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
                  defaultColor={brandTwoColor}
                  onColorChanged={(color) => {
                    updateColor(
                      'brand2',
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
                  defaultColor={brandThreeColor}
                  onColorChanged={(color) => {
                    updateColor(
                      'brand3',
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
                    <option value='aaa'>AAA (WIP)</option>
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

              <div className={cl(classes.row, classes.brandRow)}>
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
                  className={cl(
                    classes.menuItem,
                    previewMode === 'components' && classes.menuItemActive,
                  )}
                  onClick={() => setPreviewMode('components')}
                >
                  Komponenter
                </button>
                <button
                  className={cl(
                    classes.menuItem,
                    previewMode === 'dashboard' && classes.menuItemActive,
                  )}
                  onClick={() => setPreviewMode('dashboard')}
                >
                  Dashboard
                </button>
                <button
                  className={cl(
                    classes.menuItem,
                    previewMode === 'landing' && classes.menuItemActive,
                    classes.menuItemDisabled,
                  )}
                >
                  Landingsside
                </button>
                <button
                  className={cl(
                    classes.menuItem,
                    previewMode === 'forms' && classes.menuItemActive,
                    classes.menuItemDisabled,
                  )}
                >
                  Skjemaer
                </button>
                <button
                  className={cl(
                    classes.menuItem,
                    previewMode === 'auth' && classes.menuItemActive,
                    classes.menuItemDisabled,
                  )}
                >
                  Autentisering
                </button>
              </div>
              <div className={classes.toggles}>
                <button
                  className={cl(
                    classes.toggle,
                    themeMode === 'light' && classes.active,
                  )}
                  onClick={() => setThemeMode('light')}
                >
                  <img
                    src='img/light-dot.svg'
                    alt=''
                  />
                  Lys
                </button>
                <button
                  className={cl(
                    classes.toggle,
                    themeMode === 'dark' && classes.active,
                  )}
                  onClick={() => setThemeMode('dark')}
                >
                  <img
                    src='img/dark-dot.svg'
                    alt=''
                  />
                  Mørk
                </button>
                <button
                  className={cl(
                    classes.toggle,
                    themeMode === 'contrast' && classes.active,
                  )}
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
              className={cl(
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
      </Suspense>
    </div>
  );
}
