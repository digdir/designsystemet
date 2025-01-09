import { Heading } from '@digdir/designsystemet-react';
import type {
  ColorNumber,
  CssColor,
  ThemeInfo,
} from '@digdir/designsystemet/color';
import {
  getColorNameFromNumber,
  getContrastFromHex,
} from '@digdir/designsystemet/color';
import chroma from 'chroma-js';
import classes from './NeutralRow.module.css';

type NeutralRowProps = {
  themes: ThemeInfo[];
  neutralTheme: ThemeInfo;
};

type ItemProps = {
  layerOneColor: string;
  layerTwoColor: string;
  layerThreeColor: string;
  contrastBg: string;
};

type ItemsProps = {
  theme: ThemeInfo;
  number: ColorNumber;
  colorScheme: 'light' | 'dark';
  showTitle?: boolean;
};

type RowProps = {
  theme: ThemeInfo;
  colorScheme: 'light' | 'dark';
  showTitle?: boolean;
};

type RGBACssColor = `rgba(${number},${number},${number},${number})`;
type RGBAColor = number[];

const RgbaCssToArray = (rgba: RGBACssColor): RGBAColor => {
  const match = rgba.match(/rgba\((\d+), (\d+), (\d+), (\d+(\.\d+)?)\)/);
  if (!match) {
    return [0, 0, 0, 0];
  }
  return match.slice(1).map((x) => parseFloat(x)) as RGBAColor;
};

const blendColors = (
  bottom: RGBAColor,
  overlay1: RGBAColor,
  overlay2: RGBAColor,
) => {
  // Helper function to blend two layers
  function blend(bottom: RGBAColor, top: RGBAColor) {
    const [rb, gb, bb, ab] = bottom; // Bottom layer: [R, G, B, A]
    const [rt, gt, bt, at] = top; // Top layer: [R, G, B, A]

    const aRes = at + ab * (1 - at); // Resulting alpha
    const rRes = (rt * at + rb * ab * (1 - at)) / aRes;
    const gRes = (gt * at + gb * ab * (1 - at)) / aRes;
    const bRes = (bt * at + bb * ab * (1 - at)) / aRes;

    return [rRes, gRes, bRes, aRes];
  }

  // Blend the colors step by step
  const firstBlend = blend(bottom, overlay1);
  const finalBlend = blend(firstBlend, overlay2);
  // Return the final RGB color as an array of integers
  return finalBlend.slice(0, 3).map(Math.round);
};

const getContrast = ({
  layerOneColor,
  layerTwoColor,
  layerThreeColor,
  contrastBg,
}: ItemProps) => {
  console.log(layerOneColor, layerTwoColor, layerThreeColor);
  const res = [
    chroma(layerOneColor).rgba(),
    chroma(layerTwoColor).rgba(),
    chroma(layerThreeColor).rgba(),
  ];
  console.log(res);
  const test = blendColors(res[0], res[1], res[2]);
  console.log(test);
  const tomato = getContrastFromHex(
    chroma(test).hex() as CssColor,
    contrastBg as CssColor,
  ).toFixed(2);
  return tomato;
};

export const NeutralRow = ({ neutralTheme, themes }: NeutralRowProps) => {
  const Item = ({
    layerOneColor,
    layerTwoColor,
    layerThreeColor,
    contrastBg,
  }: ItemProps) => {
    return (
      <div className={classes.item} style={{ backgroundColor: layerOneColor }}>
        <div
          className={classes.innerItem}
          style={{ backgroundColor: layerTwoColor }}
        >
          <div
            className={classes.border}
            style={{ backgroundColor: layerThreeColor }}
          ></div>
        </div>
        {getContrast({
          layerOneColor,
          layerTwoColor,
          layerThreeColor,
          contrastBg,
        })}
      </div>
    );
  };

  const Row = ({ theme, colorScheme, showTitle = false }: RowProps) => {
    return (
      <div className={classes.row}>
        <Items
          theme={theme}
          number={5}
          colorScheme={colorScheme}
          showTitle={showTitle}
        />
        <Items
          theme={theme}
          number={6}
          colorScheme={colorScheme}
          showTitle={showTitle}
        />
        <Items
          theme={theme}
          number={7}
          colorScheme={colorScheme}
          showTitle={showTitle}
        />
        <Items
          theme={theme}
          number={11}
          colorScheme={colorScheme}
          showTitle={showTitle}
        />
        <Items
          theme={theme}
          number={12}
          colorScheme={colorScheme}
          showTitle={showTitle}
        />
      </div>
    );
  };

  const Items = ({
    theme,
    number,
    colorScheme,
    showTitle = false,
  }: ItemsProps) => {
    return (
      <div className={classes.items}>
        {showTitle && (
          <div className={classes.title}>
            {getColorNameFromNumber((number + 1) as ColorNumber)}
          </div>
        )}
        <div
          className={classes.itemRow}
          style={{ color: theme[colorScheme][12].hex }}
        >
          <Item
            layerOneColor={theme[colorScheme][0].hex}
            layerTwoColor={theme[colorScheme][0].hex}
            layerThreeColor={neutralTheme[colorScheme][number].hex}
            contrastBg={theme[colorScheme][0].hex}
          />
          <Item
            layerOneColor={theme[colorScheme][1].hex}
            layerTwoColor={theme[colorScheme][1].hex}
            layerThreeColor={neutralTheme[colorScheme][number].hex}
            contrastBg={theme[colorScheme][1].hex}
          />
          <Item
            layerOneColor={theme[colorScheme][1].hex}
            layerTwoColor={neutralTheme[colorScheme][2].hex}
            layerThreeColor={neutralTheme[colorScheme][number].hex}
            contrastBg={theme[colorScheme][0].hex}
          />
          <Item
            layerOneColor={theme[colorScheme][1].hex}
            layerTwoColor={neutralTheme[colorScheme][3].hex}
            layerThreeColor={neutralTheme[colorScheme][number].hex}
            contrastBg={theme[colorScheme][1].hex}
          />
          <Item
            layerOneColor={theme[colorScheme][1].hex}
            layerTwoColor={neutralTheme[colorScheme][4].hex}
            layerThreeColor={neutralTheme[colorScheme][number].hex}
            contrastBg={theme[colorScheme][1].hex}
          />
        </div>
      </div>
    );
  };

  return (
    <div className={classes.page}>
      <Heading className={classes.heading}>Light theme</Heading>
      <Row theme={themes[0]} colorScheme='light' showTitle />
      <Row theme={themes[1]} colorScheme='light' />
      <Row theme={themes[2]} colorScheme='light' />
      <Row theme={themes[3]} colorScheme='light' />
      <Row theme={themes[4]} colorScheme='light' />

      <Heading className={classes.heading}>Dark theme</Heading>
      <Row theme={themes[0]} colorScheme='dark' showTitle />
      <Row theme={themes[1]} colorScheme='dark' />
      <Row theme={themes[2]} colorScheme='dark' />
      <Row theme={themes[3]} colorScheme='dark' />
      <Row theme={themes[4]} colorScheme='dark' />
    </div>
  );
};
