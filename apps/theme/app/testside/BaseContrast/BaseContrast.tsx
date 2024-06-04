'use client';
import { Heading } from '@/packages/react';

import { ContrastBox } from '../ContrastBox/ContrastBox';
import type { ColorInfoType, ThemeType } from '../../../utils/themeUtils';

import classes from './BaseContrast.module.css';

type BaseTheme = {
  title: string;
  theme: ThemeType;
};

type BaseContrastProps = {
  themes: BaseTheme[];
};

export const BaseContrast = ({ themes }: BaseContrastProps) => {
  return (
    <div className={classes.container}>
      {themes.map((item, index) => (
        <BaseColumn
          key={index}
          title={item.title}
          colorTheme={item.theme}
        />
      ))}
    </div>
  );
};

type BaseColumnProps = {
  colorTheme: ThemeType;
  title: string;
};

const BaseColumn = ({ colorTheme, title }: BaseColumnProps) => {
  return (
    <div className={classes.column}>
      <Heading size='small'>{title}</Heading>
      <div className={classes.boxes}>
        <BaseBox
          title='Light'
          colorScale={colorTheme.light}
        />
        <BaseBox
          title='Dark'
          colorScale={colorTheme.dark}
        />
        <BaseBox
          title='Contrast'
          colorScale={colorTheme.contrast}
        />
      </div>
    </div>
  );
};

type BaseBoxProps = {
  colorScale: ColorInfoType[];
  title: string;
};

const BaseBox = ({ colorScale, title }: BaseBoxProps) => {
  return (
    <div className={classes.box}>
      <Heading
        className={classes.boxTitle}
        size='xsmall'
      >
        {title}
      </Heading>
      <div
        className={classes.item}
        style={{ backgroundColor: colorScale[8].hexColor }}
      >
        <div className={classes.colorRow}>
          <div className={classes.colorItem}>
            <div style={{ color: colorScale[13].hexColor }}>Contrast 1</div>
            {ContrastBox(colorScale[8].hexColor, colorScale[13].hexColor)}
          </div>
          <div className={classes.colorItem}>
            <div style={{ color: colorScale[14].hexColor }}>Contrast 2</div>
            {ContrastBox(colorScale[8].hexColor, colorScale[14].hexColor)}
          </div>
        </div>
      </div>
      <div
        className={classes.item}
        style={{ backgroundColor: colorScale[9].hexColor }}
      >
        <div className={classes.colorRow}>
          <div className={classes.colorItem}>
            <div style={{ color: colorScale[13].hexColor }}>Contrast 1</div>
            {ContrastBox(colorScale[9].hexColor, colorScale[13].hexColor)}
          </div>
          <div className={classes.colorItem}>
            <div style={{ color: colorScale[14].hexColor }}>Contrast 2</div>
            {ContrastBox(colorScale[9].hexColor, colorScale[14].hexColor)}
          </div>
        </div>
      </div>
      <div
        className={classes.item}
        style={{ backgroundColor: colorScale[10].hexColor }}
      >
        <div className={classes.colorRow}>
          <div className={classes.colorItem}>
            <div style={{ color: colorScale[13].hexColor }}>Contrast 1</div>
            {ContrastBox(colorScale[10].hexColor, colorScale[13].hexColor)}
          </div>
          <div className={classes.colorItem}>
            <div style={{ color: colorScale[14].hexColor }}>Contrast 2</div>
            {ContrastBox(colorScale[10].hexColor, colorScale[14].hexColor)}
          </div>
        </div>
      </div>
    </div>
  );
};
