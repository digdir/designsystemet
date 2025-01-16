'use client';

import { Heading } from '@digdir/designsystemet-react';
import type { CssColor, ThemeInfo } from '@digdir/designsystemet/color';
import chroma from 'chroma-js';
import { useEffect } from 'react';
import { ColorGrid } from './ColorGrid/ColorGrid';
import { ContrastColors } from './ContrastColors/ContrastColors';
import { ContrastTests } from './ContrastTests/ContrastTests';
import { Scales } from './Scales/Scales';
import { Sidebar } from './Sidebar/Sidebar';
import { useDebugStore } from './debugStore';
import { generateColorSchemes } from './logic/theme';
import classes from './page.module.css';

export default function Home() {
  const luminance = useDebugStore((state) => state.luminance);
  const interpolationMode = useDebugStore((state) => state.interpolationMode);
  const colorScales = useDebugStore((state) => state.colorScales);
  const setColorScales = useDebugStore((state) => state.setColorScales);
  const baseModifier = useDebugStore((state) => state.baseModifier);
  const setColorScale = useDebugStore((state) => state.setColorScale);
  const hues = [0, 22, 37, 55, 76, 124, 177, 208, 235, 278, 308];
  const steps = [
    { s: 100, l: 50 },
    { s: 100, l: 40 },
    { s: 100, l: 31 },
    { s: 100, l: 21 },
    { s: 100, l: 63 },
    { s: 62, l: 50 },
    { s: 61, l: 37 },
    { s: 59, l: 23 },
  ];

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
          'hsl',
        ).hex() as CssColor;

        const theme = generateColorSchemes(color, luminance, {
          interpolationMode,
          baseModifier,
        });

        innerThemes.push(theme);
      }
      themes.push(innerThemes);
    }
    setColorScales(themes);
    setColorScale(themes[0][0]);
  }, [luminance, interpolationMode, baseModifier]);

  return (
    <div className={classes.page}>
      <div className={classes.content}>
        <Heading className={classes.pageHeading} data-size='md'>
          Color System Debugger
        </Heading>
        <Heading className={classes.heading}>Contrast tests</Heading>
        <ContrastTests />

        <Heading className={classes.heading}>Base and contrast colors</Heading>
        <ContrastColors />

        <Heading className={classes.heading}>Color Scales</Heading>
        <Scales />

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
      </div>
      <Sidebar />
    </div>
  );
}
