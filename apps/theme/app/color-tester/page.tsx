'use client';

import { Heading } from '@digdir/designsystemet-react';
import type { CssColor, ThemeInfo } from '@digdir/designsystemet/color';
import chroma from 'chroma-js';
import cl from 'clsx/lite';
import { useEffect } from 'react';
import { ColorTables } from './ColorGrid/ColorGrid';
import { ContrastColors } from './ContrastColors/ContrastColors';
import { FrontPage } from './FrontPage/FrontPage';
import { Scales } from './Scales/Scales';
import { Sidebar } from './Sidebar/Sidebar';
import { TabMenu } from './TabMenu/TabMenu';
import { ArticlePage } from './_pages/ArticlePage/ArticlePage';
import { StatusPage } from './_pages/ArticlePage/StatusPage/StatusPage';
import { GradientPage } from './_pages/GradientPage/GradientPage';
import { Mobile } from './_pages/Mobile/Mobile';
import { SaturationPage } from './_pages/Saturationpage/SaturationPage';
import { useDebugStore } from './debugStore';
import { generateColorSchemes } from './logic/theme';
import classes from './page.module.css';

export default function Home() {
  const colorMetadata = useDebugStore((state) => state.colorMetadata);
  const colorScales = useDebugStore((state) => state.colorScales);
  const flatColorScales = useDebugStore((state) => state.flatColorScales);
  const setFlatColorScale = useDebugStore((state) => state.setFlatColorScales);
  const setColorScales = useDebugStore((state) => state.setColorScales);
  const themeSettings = useDebugStore((state) => state.themeSettings);
  const statusColors = useDebugStore((state) => state.statusColors);
  const setColorScale = useDebugStore((state) => state.setColorScale);
  const hues = [0, 22, 37, 55, 76, 124, 177, 208, 235, 278, 308];

  const steps = [
    { s: 100, l: 100 },
    { s: 100, l: 80 },
    { s: 100, l: 60 },
    { s: 100, l: 40 },
    { s: 100, l: 20 },
    { s: 100, l: 10 },
    { s: 80, l: 100 },
    { s: 80, l: 80 },
    { s: 80, l: 60 },
    { s: 80, l: 40 },
    { s: 80, l: 20 },
    { s: 80, l: 10 },
    { s: 60, l: 100 },
    { s: 60, l: 80 },
    { s: 60, l: 60 },
    { s: 60, l: 40 },
    { s: 60, l: 20 },
    { s: 60, l: 10 },
    { s: 40, l: 100 },
    { s: 40, l: 80 },
    { s: 40, l: 60 },
    { s: 40, l: 40 },
    { s: 40, l: 20 },
    { s: 40, l: 10 },
    { s: 20, l: 100 },
    { s: 20, l: 80 },
    { s: 20, l: 60 },
    { s: 20, l: 40 },
    { s: 20, l: 20 },
    { s: 20, l: 10 },
  ];
  const pageType = useDebugStore((state) => state.pageType);

  useEffect(() => {
    const themes: ThemeInfo[][] = [];
    const flatThemes = [];
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

        const theme = generateColorSchemes(color, colorMetadata, themeSettings);
        flatThemes.push(theme);
        innerThemes.push(theme);
      }
      themes.push(innerThemes);
    }
    themes[11] = [];
    themes[11].push(
      generateColorSchemes(
        chroma(0, 0, 0.23, 'hsv').hex() as CssColor,
        colorMetadata,
        themeSettings,
      ),
    );
    for (let i = 0; i < hues.length; i++) {
      const hue = hues[i];
      const color = chroma(hue, 0.5, 0.25, 'hsv').hex() as CssColor;
      const theme = generateColorSchemes(color, colorMetadata, themeSettings);
      themes[11].push(theme);
      flatThemes.push(theme);
    }

    themes[12] = [];
    themes[12].push(
      generateColorSchemes(
        statusColors.success.hex as CssColor,
        colorMetadata,
        themeSettings,
      ),
    );
    themes[12].push(
      generateColorSchemes(
        statusColors.error.hex as CssColor,
        colorMetadata,
        themeSettings,
      ),
    );
    themes[12].push(
      generateColorSchemes(
        statusColors.warning.hex as CssColor,
        colorMetadata,
        themeSettings,
      ),
    );
    themes[12].push(
      generateColorSchemes(
        statusColors.info.hex as CssColor,
        colorMetadata,
        themeSettings,
      ),
    );

    setColorScales(themes);
    setColorScale(themes[0][0]);

    const flatThemesSorted = flatThemes.sort((a, b) => {
      const aL = chroma(a.light[11].hex).oklch()[0];
      const bL = chroma(b.light[11].hex).oklch()[0];
      return aL - bL;
    });

    const groups = sortColorsByLightnessAndChroma(flatThemesSorted) as {
      [key: string]: {
        low: ThemeInfo[];
        medium: ThemeInfo[];
        high: ThemeInfo[];
        veryHigh: ThemeInfo[];
      };
    };

    setFlatColorScale(groups);
  }, [
    colorMetadata,
    themeSettings.base.modifier,
    themeSettings.interpolation.mode,
    statusColors,
  ]);

  useEffect(() => {
    const items = document.getElementsByClassName('content');
    for (let i = 0; i < items.length; i++) {
      (items[i] as HTMLElement).style.minHeight = '20svh';
    }
  }, []);

  const sortColorsByLightnessAndChroma = (themes: ThemeInfo[]) => {
    const groups: {
      [key: string]: {
        low: ThemeInfo[];
        medium: ThemeInfo[];
        high: ThemeInfo[];
        veryHigh: ThemeInfo[];
      };
    } = {
      veryDarkColors: { low: [], medium: [], high: [], veryHigh: [] },
      darkColors: { low: [], medium: [], high: [], veryHigh: [] },
      midColors: { low: [], medium: [], high: [], veryHigh: [] },
      lightColors: { low: [], medium: [], high: [], veryHigh: [] },
      veryLightColors: { low: [], medium: [], high: [], veryHigh: [] },
    };

    for (const theme of themes) {
      const [L, C, H] = chroma(theme.light[11].hex).oklch(); // Convert HEX to OKLCH

      let category:
        | 'veryDarkColors'
        | 'darkColors'
        | 'midColors'
        | 'lightColors'
        | 'veryLightColors';
      if (L < 0.2) category = 'veryDarkColors';
      else if (L >= 0.2 && L < 0.3) category = 'darkColors';
      else if (L >= 0.3 && L < 0.5) category = 'midColors';
      else if (L >= 0.5 && L < 0.7) category = 'lightColors';
      else category = 'veryLightColors';

      let chromaLevel: 'low' | 'medium' | 'high' | 'veryHigh';
      if (C < 0.08) chromaLevel = 'low';
      else if (C < 0.17) chromaLevel = 'medium';
      else if (C < 0.25) chromaLevel = 'high';
      else chromaLevel = 'veryHigh';

      groups[category][chromaLevel].push(theme);
    }

    return groups;
  };

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

        {pageType === 'baseContrast' && (
          <>
            <Heading className={classes.heading}>
              Base and contrast colors
            </Heading>
            <ContrastColors />
          </>
        )}

        {pageType === 'scales' && <Scales />}
        {pageType === 'colorTable' && <ColorTables colorScales={colorScales} />}
        {pageType === 'mobile' && <Mobile colorScales={colorScales} />}
        {pageType === 'article' && <ArticlePage colorScales={colorScales} />}
        {pageType === 'status' && <StatusPage />}
        {pageType === 'gradient' && <GradientPage />}
        {pageType === 'saturation' && (
          <SaturationPage colorScales={flatColorScales} />
        )}
      </div>
      <Sidebar />
    </div>
  );
}
