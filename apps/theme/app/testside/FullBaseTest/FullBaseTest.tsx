import type { CssColor } from '@digdir/designsystemet/color';
import {
  generateColorContrast,
  getLightnessFromHex,
  getLuminanceFromLightness,
} from '@digdir/designsystemet/color';
import cl from 'clsx/lite';
import { useEffect, useState } from 'react';

import { ContrastBox } from '../ContrastBox/ContrastBox';

import chroma from 'chroma-js';
import classes from './FullBaseTest.module.css';
export const FullBaseTest = () => {
  const [blueColors, setBlueColors] = useState<CssColor[]>([]);

  useEffect(() => {
    const blue = GenerateColor('#0062BA');
    setBlueColors(blue);
  }, []);

  const GenerateColor = (color: CssColor) => {
    const lightnessScale: number[] = [];

    for (let i = 0; i <= 100; i++) {
      lightnessScale.push(getLuminanceFromLightness(i));
    }

    const output: CssColor[] = [];

    for (const lightness of lightnessScale) {
      output.push(chroma(color).luminance(lightness).hex() as CssColor);
    }

    return output;
  };

  const Column = ({ color, index }: { color: CssColor; index: number }) => {
    return (
      <div className={classes.column}>
        <div className={classes.boxTitle}>{index + 1}</div>
        <div className={classes.textContrast}>
          <div>Hvit kontrast</div>
          <div>Svart kontrast</div>
        </div>
        <div className={classes.boxes}>
          <Box color={color} theme='light' />
          <Box color={color} theme='dark' />
          <Box color={color} theme='contrast' />
        </div>
      </div>
    );
  };

  const List = ({
    baseDefault,
    baseHover,
    baseActive,
    bgColor,
    active,
    theme,
  }: {
    baseDefault: CssColor;
    baseHover: CssColor;
    baseActive: CssColor;
    bgColor: CssColor;
    active: boolean;
    theme: 'light' | 'dark' | 'contrast';
  }) => {
    let bgDefault = blueColors[99];
    let bgSubtle = blueColors[95];

    if (theme === 'dark') {
      bgDefault = blueColors[9];
      bgSubtle = blueColors[13];
    } else if (theme === 'contrast') {
      bgDefault = blueColors[0];
      bgSubtle = blueColors[5];
    }

    return (
      <div className={cl(classes.list, active && classes.listActive)}>
        <Item mainColor={baseDefault} bgColor={bgColor} />
        <Item mainColor={baseHover} bgColor={bgColor} />
        <Item mainColor={baseActive} bgColor={bgColor} />
        <Item mainColor={bgDefault} bgColor={baseDefault} />
        <Item mainColor={bgSubtle} bgColor={baseDefault} />
      </div>
    );
  };

  const Box = ({
    color,
    theme,
  }: {
    color: CssColor;

    theme: 'light' | 'dark' | 'contrast';
  }) => {
    let lightness = Math.round(getLightnessFromHex(color));
    if (theme === 'dark' || theme === 'contrast') {
      lightness = lightness <= 30 ? 70 : 100 - lightness;
    }

    let modifier = 8;

    //
    if (lightness <= 30) {
      modifier = -modifier;
    }
    // 49 is when the contrast flips from white to black, 65 is when the contrast flips from black to white
    if (lightness >= 49 && lightness <= 65) {
      modifier = -modifier;
    }

    const baseDefault = blueColors[lightness];
    const baseHover = blueColors[lightness - modifier];
    const baseActive = blueColors[lightness - modifier * 2];

    const contrastOneColor = generateColorContrast(
      blueColors[lightness],
      'default',
    );

    return (
      <div
        className={cl(
          classes.box,
          theme === 'dark' && classes.boxDark,
          theme === 'contrast' && classes.boxContrast,
        )}
      >
        <List
          bgColor='#ffffff'
          baseDefault={baseDefault}
          baseHover={baseHover}
          baseActive={baseActive}
          active={contrastOneColor === '#ffffff'}
          theme={theme}
        />
        <List
          bgColor='#000000'
          baseDefault={baseDefault}
          baseHover={baseHover}
          baseActive={baseActive}
          active={contrastOneColor === '#000000'}
          theme={theme}
        />
      </div>
    );
  };

  const Item = ({
    mainColor,
    bgColor,
  }: {
    mainColor: CssColor;
    bgColor: CssColor;
  }) => {
    return (
      <div className={classes.item}>
        <div
          className={classes.btn}
          style={{ backgroundColor: mainColor, color: bgColor }}
        >
          {ContrastBox(mainColor, bgColor)}
          Aa
        </div>
      </div>
    );
  };

  return (
    <div className={classes.content}>
      {blueColors.map(
        (color, index) =>
          index + 1 >= 20 &&
          index + 1 <= 80 && <Column key={index} color={color} index={index} />,
      )}
    </div>
  );
};
