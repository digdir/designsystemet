/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
'use client';

import type { CssColor } from '@adobe/leonardo-contrast-colors';
import { Heading } from '@digdir/designsystemet-react';
import cn from 'classnames';
import { useEffect } from 'react';

import { generateColorTheme } from '@/utils/themeUtils';

import classes from './Interaction.module.css';

export const Interaction = () => {
  const theme1 = generateColorTheme('#0062BA');
  const theme2 = generateColorTheme('#1E98F5');
  const theme3 = generateColorTheme('#E5AA20');
  const theme4 = generateColorTheme('#f3e02e');
  const theme5 = generateColorTheme('#e32d22');
  const theme6 = generateColorTheme('#F45F63');
  const theme7 = generateColorTheme('#054449');
  const theme8 = generateColorTheme('#7befb2');
  const theme9 = generateColorTheme('#410464');
  const theme10 = generateColorTheme('#A845E1');
  const theme11 = generateColorTheme('#0c949b');
  const theme12 = generateColorTheme('#19e1eb');

  return (
    <div className={classes.container}>
      <div className={classes.row}>
        <Column
          title='Light'
          scales={[
            theme1.light,
            theme2.light,
            theme3.light,
            theme4.light,
            theme5.light,
            theme6.light,
            theme7.light,
            theme8.light,
            theme9.light,
            theme10.light,
            theme11.light,
            theme12.light,
          ]}
        />
        <Column
          title='Dark'
          scales={[
            theme1.dark,
            theme2.dark,
            theme3.dark,
            theme4.dark,
            theme5.dark,
            theme6.dark,
            theme7.dark,
            theme8.dark,
            theme9.dark,
            theme10.dark,
            theme11.dark,
            theme12.dark,
          ]}
        />
        <Column
          title='Contrast'
          scales={[
            theme1.contrast,
            theme2.contrast,
            theme3.contrast,
            theme4.contrast,
            theme5.contrast,
            theme6.contrast,
            theme7.contrast,
            theme8.contrast,
            theme9.contrast,
            theme10.contrast,
            theme11.contrast,
            theme12.contrast,
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
    <div
      className={classes.column}
      style={{ backgroundColor: scales[0][0] }}
    >
      <Heading
        className={classes.boxTitle}
        size='xsmall'
        style={{ color: scales[0][12] }}
      >
        {title}
      </Heading>
      <div className={classes.boxes}>
        <Box
          colorIndex={2}
          scales={scales}
          type='surface'
          columnTitle={title}
        />
        <Box
          colorIndex={8}
          scales={scales}
          type='base'
          columnTitle={title}
        />
      </div>
    </div>
  );
};

type BoxProps = {
  colorIndex: number;
  scales: CssColor[][];
  type: 'base' | 'surface';
  columnTitle: string;
};

const Box = ({ scales, colorIndex, type, columnTitle }: BoxProps) => {
  const setToken = (token: string, color: string, id: string) => {
    const previewElement = document.getElementById(id);
    if (previewElement) {
      previewElement.style.setProperty(token, color);
    }
  };

  useEffect(() => {
    for (let i = 0; i < 12; i++) {
      // Hover
      setToken(
        '--interaction' + i + 'Hover',
        scales[i][type === 'surface' ? 3 : 9],
        'box' + type + columnTitle,
      );
      // Active
      setToken(
        '--interaction' + i + 'Active',
        scales[i][type === 'surface' ? 4 : 10],
        'box' + type + columnTitle,
      );
    }
  }, [columnTitle, scales, type]);

  return (
    <div
      className={cn(classes.box)}
      id={'box' + type + columnTitle}
    >
      {scales.map((scale, index) => (
        <div
          key={index}
          className={cn(classes.surface, 'interactionSurface' + index)}
          style={{
            backgroundColor: scales[index][colorIndex],
            color: type === 'base' ? scales[index][13] : scales[index][12],
          }}
        >
          Tekst
        </div>
      ))}
    </div>
  );
};
