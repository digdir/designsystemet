import {
  type CssColor,
  type ThemeInfo,
  getContrastFromHex,
  getLightnessFromHex,
} from '@digdir/designsystemet/color';
import chroma from 'chroma-js';
import { useDebugStore } from '../debugStore';
import { ColorIndexes } from '../utils';
import classes from './ContrastColors.module.css';

export const ContrastColors = () => {
  const colorScales = useDebugStore((state) => state.colorScales);
  const themeSettings = useDebugStore((state) => state.themeSettings);
  const colorHeadings = [
    'Red',
    'Pure Orange',
    'Light Orange',
    'Yellow',
    'Pale Green',
    'Green',
    'Cyan',
    'Blue',
    'Strong Blue',
    'Purple',
    'Pink',
  ];

  const contrastSection = (color1: CssColor, color2: CssColor) => {
    const contrast = getContrastFromHex(color1, color2).toFixed(2);
    return (
      <div className={classes.contrastSection}>
        <div
          className={classes.contrastCircle}
          style={{ backgroundColor: color2 }}
        ></div>
        <div>{contrast}</div>
      </div>
    );
  };

  const Item = ({
    color,
    scheme,
    hideSecondCircle,
  }: { color: CssColor; scheme: ThemeInfo; hideSecondCircle?: boolean }) => {
    return (
      <div className={classes.item}>
        <div className={classes.color} style={{ backgroundColor: color }}></div>
        <div className={classes.content}>
          <div className={classes.textContent}>
            <div>Li: {getLightnessFromHex(color).toFixed(1)}</div>
            <div>Lu: {chroma(color).luminance().toFixed(2)}</div>
          </div>
          <div className={classes.contrastContent}>
            <div>
              <div>{contrastSection(color, '#ffffff')}</div>
              <div>{contrastSection(color, '#000000')}</div>
            </div>
            <div>
              {!hideSecondCircle && (
                <div>
                  {contrastSection(
                    color,
                    scheme[themeSettings.general.colorScheme][
                      ColorIndexes.baseContrastSubtle
                    ].hex,
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={classes.container}>
      {colorScales.map((outerScales, outerKey) => (
        <div key={outerKey} className={classes.groups}>
          <div className={classes.groupHeading}>{colorHeadings[outerKey]}</div>
          <div className={classes.groupContainer}>
            {outerScales.map((innerScale, key) => (
              <div key={key} className={classes.group}>
                <Item
                  color={
                    innerScale[themeSettings.general.colorScheme][
                      ColorIndexes.baseDefault
                    ].hex
                  }
                  scheme={innerScale}
                />
                <Item
                  color={
                    innerScale[themeSettings.general.colorScheme][
                      ColorIndexes.baseHover
                    ].hex
                  }
                  scheme={innerScale}
                  hideSecondCircle
                />
                <Item
                  color={
                    innerScale[themeSettings.general.colorScheme][
                      ColorIndexes.baseActive
                    ].hex
                  }
                  scheme={innerScale}
                  hideSecondCircle
                />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
