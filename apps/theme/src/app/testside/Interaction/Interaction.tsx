'use client';

import type { CssColor } from '@adobe/leonardo-contrast-colors';
import { Heading } from '@/packages/react';
import cl from 'clsx/lite';
import { useEffect } from 'react';

import type { ThemeType } from '../../../utils/themeUtils';

import classes from './Interaction.module.css';

type InteractionProps = {
  theme1: ThemeType;
  theme2: ThemeType;
  theme3: ThemeType;
  theme4: ThemeType;
  theme5: ThemeType;
  theme6: ThemeType;
  theme7: ThemeType;
  theme8: ThemeType;
  theme9: ThemeType;
  theme10: ThemeType;
  theme11: ThemeType;
  theme12: ThemeType;
};

export const Interaction = ({
  theme1,
  theme2,
  theme3,
  theme4,
  theme5,
  theme6,
  theme7,
  theme8,
  theme9,
  theme10,
  theme11,
  theme12,
}: InteractionProps) => {
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
        size='xs'
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
        <Box2
          colorIndex={8}
          scales={scales}
          type='base'
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
      className={cl(classes.box)}
      id={'box' + type + columnTitle}
    >
      {scales.map((scale, index) => (
        <div
          key={index}
          className={cl(classes.surface, 'interactionSurface' + index)}
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

const Box2 = ({ scales, type, columnTitle }: BoxProps) => {
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
    <div className={cl(classes.box)}>
      {scales.map((scale, index) => (
        <div
          key={index}
          className={cl(classes.surface, 'interactionSurface' + index)}
          style={{
            color: scales[index][11],
            borderColor: scales[index][8],
          }}
        >
          Tekst
        </div>
      ))}
    </div>
  );
};
