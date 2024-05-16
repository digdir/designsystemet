/* eslint-disable @next/next/no-img-element */
'use client';

import { useEffect, useState } from 'react';
import type { CssColor } from '@adobe/leonardo-contrast-colors';
import { ChevronDownIcon } from '@navikt/aksel-icons';
import cn from 'classnames';
import { DropdownMenu } from '@digdir/designsystemet-react';

import { Container } from './components/Container/Container';

import { mapTokens } from '@/utils/tokenMapping';
import { generateColorScale, setContrastOneColor } from '@/utils/themeUtils';
import type { modeType } from '@/types';

import { Landing } from './components/Previews/Landing/Landing';
import { Dashboard } from './components/Previews/Dashboard/Dashboard';
import { Components } from './components/Previews/Components/Components';
import { ColorPicker } from './components/ColorPicker/ColorPicker';
import { Scale } from './components/Scale/Scale';
import { Header } from './components/Header/Header';
import classes from './page.module.css';

type previewModeType =
  | 'dashboard'
  | 'landing'
  | 'forms'
  | 'auth'
  | 'components';

export default function Home() {
  const [accentColor, setAccentColor] = useState<CssColor>('#0062BA');
  const [greyColor, setGreyColor] = useState<CssColor>('#1E2B3C');
  const [brandOneColor, setBrandOneColor] = useState<CssColor>('#F45F63');
  const [brandTwoColor, setBrandTwoColor] = useState<CssColor>('#E5AA20');
  const [brandThreeColor, setBrandThreeColor] = useState<CssColor>('#1E98F5');
  const [themeMode, setThemeMode] = useState<modeType>('light');
  const [previewMode, setPreviewMode] = useState<previewModeType>('components');

  useEffect(() => {
    setContrastOneColor('#000000', 'first', true);
    mapTokens();
  }, []);

  // Sticky Menu Area
  useEffect(() => {
    window.addEventListener('scroll', isSticky);
    return () => {
      window.removeEventListener('scroll', isSticky);
    };
  });

  const generateJsonForColor = (colorArray: []) => {
    const obj = {};
    for (let i = 0; i < colorArray.length; i++) {
      if (i === 13) {
        obj['contrast-1'] = {
          value: colorArray[i],
          type: 'color',
        };
      } else if (i === 14) {
        obj['contrast-2'] = {
          value: colorArray[i],
          type: 'color',
        };
      } else {
        obj[i + 1] = { value: colorArray[i], type: 'color' };
      }
    }
    return obj;
  };

  const copyThemeToClipboard = (theme: modeType) => {
    const accentColors = generateColorScale(accentColor, theme, 'flat');
    const neutralColors = generateColorScale(greyColor, theme, 'flat');
    const brand1Colors = generateColorScale(brandOneColor, theme, 'flat');
    const brand2Colors = generateColorScale(brandTwoColor, theme, 'flat');
    const brand3Colors = generateColorScale(brandThreeColor, theme, 'flat');

    const obj = {
      theme1: {
        accent: generateJsonForColor(accentColors),
        neutral: generateJsonForColor(neutralColors),
        brand1: generateJsonForColor(brand1Colors),
        brand2: generateJsonForColor(brand2Colors),
        brand2: generateJsonForColor(brand3Colors),
      },
    };

    const json = JSON.stringify(obj, null, '\t');
    console.log(json);
    navigator.clipboard.writeText(json);
  };

  const copyGlobalsToClipboard = (theme: modeType) => {
    const blueColors = generateColorScale('#0A71C0', theme, 'flat');
    const greenColors = generateColorScale('#07991A', theme, 'flat');
    const orangeColors = generateColorScale('#D46223', theme, 'flat');
    const purpleColors = generateColorScale('#663299', theme, 'flat');
    const redColors = generateColorScale('#E51C1D', theme, 'flat');
    const yellowColors = generateColorScale('#EABF28', theme, 'flat');

    const obj = {
      global: {
        blue: generateJsonForColor(blueColors),
        green: generateJsonForColor(greenColors),
        orange: generateJsonForColor(orangeColors),
        purple: generateJsonForColor(purpleColors),
        red: generateJsonForColor(redColors),
        yellow: generateJsonForColor(yellowColors),
      },
    };

    const json = JSON.stringify(obj, null, '\t');
    console.log(json);
    navigator.clipboard.writeText(json);
  };

  const isSticky = (e) => {
    const header = document.querySelector('.pickers');
    const scrollTop = window.scrollY;
    scrollTop >= 250
      ? header.classList.add('is-sticky')
      : header.classList.remove('is-sticky');
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
                label='Accent'
                defaultColor='#0062BA'
                onColorChanged={(e: any) => {
                  setAccentColor(e);
                }}
              />
              <ColorPicker
                label='Neutral'
                defaultColor='#1E2B3C'
                onColorChanged={(e: any) => {
                  setGreyColor(e);
                }}
              />
              <ColorPicker
                label='Brand 1'
                defaultColor='#F45F63'
                onColorChanged={(e: any) => {
                  setBrandOneColor(e);
                }}
              />
              <ColorPicker
                label='Brand 2'
                defaultColor='#E5AA20'
                onColorChanged={(e: any) => {
                  setBrandTwoColor(e);
                }}
              />
              <ColorPicker
                label='Brand 3'
                defaultColor='#1E98F5'
                onColorChanged={(e: any) => {
                  setBrandThreeColor(e);
                }}
              />
              <div className={classes.dropdown}>
                <DropdownMenu
                  placement='bottom-end'
                  size='small'
                >
                  <DropdownMenu.Trigger
                    size='medium'
                    className={classes.dropdownBtn}
                  >
                    Kopier
                    <ChevronDownIcon
                      title='a11y-title'
                      fontSize='1.5rem'
                    />
                  </DropdownMenu.Trigger>
                  <DropdownMenu.Content>
                    <DropdownMenu.Group heading='Themes'>
                      <DropdownMenu.Item
                        onClick={() => copyThemeToClipboard('light')}
                      >
                        Light theme
                      </DropdownMenu.Item>
                      <DropdownMenu.Item
                        onClick={() => copyThemeToClipboard('dark')}
                      >
                        Dark theme
                      </DropdownMenu.Item>
                      <DropdownMenu.Item
                        onClick={() => copyThemeToClipboard('contrast')}
                      >
                        Contrast theme
                      </DropdownMenu.Item>
                    </DropdownMenu.Group>
                    <DropdownMenu.Group heading='Globals'>
                      <DropdownMenu.Item
                        onClick={() => copyGlobalsToClipboard('light')}
                      >
                        Globals Light
                      </DropdownMenu.Item>
                      <DropdownMenu.Item
                        onClick={() => copyGlobalsToClipboard('dark')}
                      >
                        Globals dark
                      </DropdownMenu.Item>
                      <DropdownMenu.Item
                        onClick={() => copyGlobalsToClipboard('contrast')}
                      >
                        Globals contrast
                      </DropdownMenu.Item>
                    </DropdownMenu.Group>
                  </DropdownMenu.Content>
                </DropdownMenu>
              </div>
            </div>
          </div>
          <div className={classes.rows}>
            <div className={classes.row}>
              <div className={classes.scaleLabel}>Accent</div>
              <Scale
                color={accentColor}
                showHeader
                showColorMeta={false}
                themeMode={themeMode}
                type='accent'
              />
            </div>
            <div className={classes.row}>
              <div className={classes.scaleLabel}>Neutral</div>
              <Scale
                color={greyColor}
                showColorMeta={false}
                themeMode={themeMode}
                type='grey'
              />
            </div>

            <div className={cn(classes.row, classes.brandRow)}>
              <div className={classes.scaleLabel}>Brand 1</div>
              <Scale
                color={brandOneColor}
                showColorMeta={false}
                themeMode={themeMode}
                type='brandOne'
              />
            </div>
            <div className={classes.row}>
              <div className={classes.scaleLabel}>Brand 2</div>
              <Scale
                color={brandTwoColor}
                showColorMeta={false}
                themeMode={themeMode}
                type='brandTwo'
              />
            </div>

            <div className={classes.row}>
              <div className={classes.scaleLabel}>Brand 3</div>
              <Scale
                color={brandThreeColor}
                showColorMeta={false}
                themeMode={themeMode}
                type='brandThree'
              />
            </div>
          </div>

          <div className={classes.toolbar}>
            <div className={classes.menu}>
              <div
                className={cn(classes.menuItem, {
                  [classes.menuItemActive]: previewMode === 'components',
                })}
                onClick={() => setPreviewMode('components')}
              >
                Komponenter
              </div>
              <div
                className={cn(classes.menuItem, {
                  [classes.menuItemActive]: previewMode === 'dashboard',
                })}
                onClick={() => setPreviewMode('dashboard')}
              >
                Dashboard
              </div>
              <div
                className={cn(
                  classes.menuItem,
                  {
                    [classes.menuItemActive]: previewMode === 'landing',
                  },
                  classes.menuItemDisabled,
                )}
              >
                Landingsside
              </div>
              <div
                className={cn(
                  classes.menuItem,
                  {
                    [classes.menuItemActive]: previewMode === 'forms',
                  },
                  classes.menuItemDisabled,
                )}
              >
                Skjemaer
              </div>
              <div
                className={cn(
                  classes.menuItem,
                  {
                    [classes.menuItemActive]: previewMode === 'auth',
                  },
                  classes.menuItemDisabled,
                )}
              >
                Autentisering
              </div>
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
                />{' '}
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
                />{' '}
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
                />{' '}
                Kontrast
              </button>
            </div>
          </div>

          <div
            className={cn(classes.preview, classes[themeMode])}
            id='preview'
          >
            {previewMode === 'components' && <Components />}
            {previewMode === 'dashboard' && <Dashboard />}
            {previewMode === 'landing' && <Landing />}
          </div>
          {/* <PreviewBox /> */}
        </Container>
      </main>
    </div>
  );
}
