'use client';

import { Heading } from '@digdir/designsystemet-react';
import type { CssColor, ThemeInfo } from '@digdir/designsystemet/color';
import chroma from 'chroma-js';
import cl from 'clsx/lite';
import { useEffect } from 'react';
import { ColorGrid } from './ColorGrid/ColorGrid';
import { ColorSaturation } from './ColorSaturation/ColorSaturation';
import { ContrastColors } from './ContrastColors/ContrastColors';
import { FrontPage } from './FrontPage/FrontPage';
import { Mobile } from './Mobile/Mobile';
import { Scales } from './Scales/Scales';
import { Sidebar } from './Sidebar/Sidebar';
import { TabMenu } from './TabMenu/TabMenu';
import { ArticlePage } from './_pages/ArticlePage/ArticlePage';
import { useDebugStore } from './debugStore';
import { generateColorSchemes } from './logic/theme';
import classes from './page.module.css';

export default function Home() {
  const luminance = useDebugStore((state) => state.luminance);
  const colorScales = useDebugStore((state) => state.colorScales);
  const setColorScales = useDebugStore((state) => state.setColorScales);
  const themeSettings = useDebugStore((state) => state.themeSettings);
  const setColorScale = useDebugStore((state) => state.setColorScale);
  const hues = [0, 22, 37, 55, 76, 124, 177, 208, 235, 278, 308];
  const blackHues = [0, 55, 77];
  const steps = [
    { s: 100, l: 100 },
    { s: 100, l: 80 },
    { s: 100, l: 60 },
    { s: 100, l: 40 },
    { s: 80, l: 100 },
    { s: 80, l: 80 },
    { s: 80, l: 60 },
    { s: 60, l: 100 },
    { s: 60, l: 80 },
  ];
  const pageType = useDebugStore((state) => state.pageType);

  useEffect(() => {
    const themes: ThemeInfo[][] = [];
    for (let i = 0; i < hues.length; i++) {
      const hue = hues[i];
      const innerThemes = [];
      for (let j = 0; j < steps.length; j++) {
        const step = steps[j];
        const color = chroma(
          hue,
          step.s / 100,
          step.l / 100,
          'hsv',
        ).hex() as CssColor;

        const theme = generateColorSchemes(color, luminance, themeSettings);

        innerThemes.push(theme);
      }
      themes.push(innerThemes);
    }
    themes[11] = [];
    for (let i = 0; i < blackHues.length; i++) {
      const hue = hues[i];
      const color = chroma(hue, 1, 0.15, 'hsv').hex() as CssColor;
      const theme = generateColorSchemes(color, luminance, themeSettings);
      themes[11].push(theme);
    }

    setColorScales(themes);
    setColorScale(themes[0][0]);
  }, [
    luminance,
    themeSettings.base.modifier,
    themeSettings.interpolation.mode,
  ]);

  useEffect(() => {
    const items = document.getElementsByClassName('content');
    console.log(items);
    for (let i = 0; i < items.length; i++) {
      (items[i] as HTMLElement).style.minHeight = '20svh';
    }
  }, []);

  return (
    <div className={classes.page} data-color-scheme='light'>
      <TabMenu />
      <div
        className={cl(
          classes.top,
          themeSettings.general.testMode === 'production' && classes.topProd,
        )}
      ></div>
      <div className={classes.content}>
        {pageType === 'main' && <FrontPage />}
        {pageType === 'saturation' && (
          <>
            <Heading className={classes.heading}>
              Saturation adjustments
            </Heading>
            <ColorSaturation />
          </>
        )}

        {pageType === 'baseContrast' && (
          <>
            <Heading className={classes.heading}>
              Base and contrast colors
            </Heading>
            <ContrastColors />
          </>
        )}

        {pageType === 'scales' && (
          <>
            <Heading className={classes.heading}>Color Scales</Heading>
            <Scales />
          </>
        )}

        {pageType === 'colorTable' && (
          <>
            <Heading className={classes.heading}>Background subtle</Heading>
            <ColorGrid colors={colorScales} colorNumber={1} />

            <Heading className={classes.heading}>Surface Default</Heading>
            <ColorGrid colors={colorScales} colorNumber={2} />
            <Heading className={classes.heading}>Surface Hover</Heading>
            <ColorGrid colors={colorScales} colorNumber={3} />
            <Heading className={classes.heading}>Surface Active</Heading>
            <ColorGrid colors={colorScales} colorNumber={4} />

            <Heading className={classes.heading}>Border Subtle</Heading>
            <ColorGrid colors={colorScales} colorNumber={5} />
            <Heading className={classes.heading}>Border Default</Heading>
            <ColorGrid colors={colorScales} colorNumber={6} />
            <Heading className={classes.heading}>Border Strong</Heading>
            <ColorGrid colors={colorScales} colorNumber={7} />

            <Heading className={classes.heading}>Text Subtle</Heading>
            <ColorGrid colors={colorScales} colorNumber={11} />
            <Heading className={classes.heading}>Text Default</Heading>
            <ColorGrid colors={colorScales} colorNumber={12} />
          </>
        )}

        {pageType === 'mobile' && <Mobile colorScales={colorScales} />}
        {pageType === 'article' && <ArticlePage colorScales={colorScales} />}
      </div>
      <Sidebar />
    </div>
  );
}
