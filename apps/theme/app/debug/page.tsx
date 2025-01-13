'use client';

import { Heading } from '@digdir/designsystemet-react';
import type { CssColor, ThemeInfo } from '@digdir/designsystemet/color';
import chroma from 'chroma-js';
import { ColorGrid } from './ColorGrid/ColorGrid';
import { Sidebar } from './Sidebar/Sidebar';
import { useDebugStore } from './debugStore';
import { generateColorSchemes } from './logic/theme';
import classes from './page.module.css';

export default function Home() {
  const luminance = useDebugStore((state) => state.luminance);

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

  const GetColors = () => {
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

        const theme = generateColorSchemes(color, luminance);

        innerThemes.push(theme);
      }
      themes.push(innerThemes);
    }

    return themes;
  };

  return (
    <div className={classes.page}>
      <div className={classes.content}>
        <Heading>Background subtle</Heading>
        <ColorGrid colors={GetColors()} colorNumber={1} />
        <Heading>dddd</Heading>
        <ColorGrid colors={GetColors()} colorNumber={2} />
        <Heading>dddd</Heading>
        <ColorGrid colors={GetColors()} colorNumber={7} />
      </div>
      <Sidebar />
    </div>
  );
}
