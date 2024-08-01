'use client';
import { Heading } from '@digdir/designsystemet-react';
import type { ColorInfo, ThemeInfo } from '@digdir/designsystemet/color';

import { ContrastBox } from '../ContrastBox/ContrastBox';

import classes from './BaseContrast.module.css';

type BaseTheme = {
  title: string;
  theme: ThemeInfo;
};

type BaseContrastProps = {
  themes: BaseTheme[];
};

export const BaseContrast = ({ themes }: BaseContrastProps) => {
  return (
    <div className={classes.container}>
      {themes.map((item, index) => (
        <BaseColumn key={index} title={item.title} colorTheme={item.theme} />
      ))}
    </div>
  );
};

type BaseColumnProps = {
  colorTheme: ThemeInfo;
  title: string;
};

const BaseColumn = ({ colorTheme, title }: BaseColumnProps) => {
  return (
    <div className={classes.column}>
      <Heading size='sm'>{title}</Heading>
      <div className={classes.boxes}>
        <BaseBox title='Light' colorScale={colorTheme.light} />
        <BaseBox title='Dark' colorScale={colorTheme.dark} />
        <BaseBox title='Contrast' colorScale={colorTheme.contrast} />
      </div>
    </div>
  );
};

type BaseBoxProps = {
  colorScale: ColorInfo[];
  title: string;
};

const BaseBox = ({ colorScale, title }: BaseBoxProps) => {
  return (
    <div className={classes.box}>
      <Heading className={classes.boxTitle} size='xs'>
        {title}
      </Heading>
      <div
        className={classes.item}
        style={{ backgroundColor: colorScale[8].hex }}
      >
        <div className={classes.colorRow}>
          <div className={classes.colorItem}>
            <div style={{ color: colorScale[13].hex }}>Contrast 1</div>
            {ContrastBox(colorScale[8].hex, colorScale[13].hex)}
          </div>
          <div className={classes.colorItem}>
            <div style={{ color: colorScale[14].hex }}>Contrast 2</div>
            {ContrastBox(colorScale[8].hex, colorScale[14].hex)}
          </div>
        </div>
      </div>
      <div
        className={classes.item}
        style={{ backgroundColor: colorScale[9].hex }}
      >
        <div className={classes.colorRow}>
          <div className={classes.colorItem}>
            <div style={{ color: colorScale[13].hex }}>Contrast 1</div>
            {ContrastBox(colorScale[9].hex, colorScale[13].hex)}
          </div>
          <div className={classes.colorItem}>
            <div style={{ color: colorScale[14].hex }}>Contrast 2</div>
            {ContrastBox(colorScale[9].hex, colorScale[14].hex)}
          </div>
        </div>
      </div>
      <div
        className={classes.item}
        style={{ backgroundColor: colorScale[10].hex }}
      >
        <div className={classes.colorRow}>
          <div className={classes.colorItem}>
            <div style={{ color: colorScale[13].hex }}>Contrast 1</div>
            {ContrastBox(colorScale[10].hex, colorScale[13].hex)}
          </div>
          <div className={classes.colorItem}>
            <div style={{ color: colorScale[14].hex }}>Contrast 2</div>
            {ContrastBox(colorScale[10].hex, colorScale[14].hex)}
          </div>
        </div>
      </div>
    </div>
  );
};
