/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
'use client';

import type { CssColor } from '@adobe/leonardo-contrast-colors';
import { Heading } from '@digdir/designsystemet-react';

import { generateColorTheme } from '@/utils/themeUtils';

import classes from './BackgroundSurface.module.css';

export const BackgroundSurface = () => {
  const greyTheme = generateColorTheme('#243142');
  const redTheme = generateColorTheme('#E51C1D');
  const orangeTheme = generateColorTheme('#D46223');
  const yellowTheme = generateColorTheme('#EABF28');
  const greenTheme = generateColorTheme('#07991A');
  const cyanTheme = generateColorTheme('#0AB5C0');
  const blueTheme = generateColorTheme('#0062BA');
  const purpleTheme = generateColorTheme('#663299');

  return (
    <div className={classes.container}>
      <div className={classes.row}>
        <Column
          title='Light'
          scales={[
            greyTheme.light,
            redTheme.light,
            orangeTheme.light,
            yellowTheme.light,
            greenTheme.light,
            cyanTheme.light,
            blueTheme.light,
            purpleTheme.light,
          ]}
        />
        <Column
          title='Dark'
          scales={[
            greyTheme.dark,
            redTheme.dark,
            orangeTheme.dark,
            yellowTheme.dark,
            greenTheme.dark,
            cyanTheme.dark,
            blueTheme.dark,
            purpleTheme.dark,
          ]}
        />
        <Column
          title='Contrast'
          scales={[
            greyTheme.contrast,
            redTheme.contrast,
            orangeTheme.contrast,
            yellowTheme.contrast,
            greenTheme.contrast,
            cyanTheme.contrast,
            blueTheme.contrast,
            purpleTheme.contrast,
          ]}
        />
      </div>
    </div>
  );
};

type ColumnProps = {
  title: string;
  scales: CssColor[][];
};

const Column = ({ title, scales }: ColumnProps) => {
  return (
    <div className={classes.column}>
      <Heading
        className={classes.boxTitle}
        size='xsmall'
      >
        {title}
      </Heading>
      <div className={classes.boxes}>
        <Box
          colorScale={scales[0]}
          backgroundIndex={1}
          scales={scales}
        />
        <Box
          colorScale={scales[1]}
          backgroundIndex={1}
          scales={scales}
        />
        <Box
          colorScale={scales[5]}
          backgroundIndex={1}
          scales={scales}
        />
      </div>
    </div>
  );
};

type BoxProps = {
  colorScale: CssColor[];
  backgroundIndex: 0 | 1;
  scales: CssColor[][];
};

const Box = ({ colorScale, backgroundIndex, scales }: BoxProps) => {
  return (
    <div
      className={classes.box}
      style={{ backgroundColor: colorScale[backgroundIndex] }}
    >
      <div
        className={classes.surface}
        style={{ backgroundColor: scales[0][2] }}
      ></div>
      <div
        className={classes.surface}
        style={{ backgroundColor: scales[1][2] }}
      />
      <div
        className={classes.surface}
        style={{ backgroundColor: scales[2][2] }}
      />
      <div
        className={classes.surface}
        style={{ backgroundColor: scales[3][2] }}
      />
      <div
        className={classes.surface}
        style={{ backgroundColor: scales[4][2] }}
      />
      <div
        className={classes.surface}
        style={{ backgroundColor: scales[5][2] }}
      />
      <div
        className={classes.surface}
        style={{ backgroundColor: scales[6][2] }}
      />
      <div
        className={classes.surface}
        style={{ backgroundColor: scales[7][2] }}
      />
    </div>
  );
};
