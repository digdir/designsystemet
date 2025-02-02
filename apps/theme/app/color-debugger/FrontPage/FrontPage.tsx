import {
  type CssColor,
  type ThemeInfo,
  getContrastFromHex,
} from '@digdir/designsystemet/color';
import {} from '@navikt/aksel-icons';
import chroma from 'chroma-js';
import cl from 'clsx/lite';
import { useEffect, useState } from 'react';
import { ColorScale } from '../ColorScale/ColorScale';
import { ContrastChecker } from '../ContrastChecker/ContrastChecker';
import {
  type LuminanceType,
  type ThemeSettingsType,
  useDebugStore,
} from '../debugStore';
import { generateColorSchemes } from '../logic/theme';
import classes from './FrontPage.module.css';

type ItemProps = {
  text: string;
  text2?: string;
  text3?: string;
  error: boolean;
};

const borderDefaultIndex = 7;
const borderStrongIndex = 8;
const textSubtleIndex = 9;
const textDefaultIndex = 10;
const baseDefaultIndex = 11;
const baseHoverIndex = 12;
const baseActiveIndex = 13;
const baseContrastSubtleIndex = 14;
const baseContrastDefaultIndex = 15;

const generateBaseThemes = (
  luminance: LuminanceType,
  themeSettings: ThemeSettingsType,
) => {
  const themes = [];
  for (let i = 0; i < 100; i++) {
    const color = chroma('#0062BA')
      .luminance((i + 1) / 100)
      .hex() as CssColor;
    themes.push(generateColorSchemes(color, luminance, themeSettings));
  }
  return themes;
};

export const FrontPage = () => {
  const luminance = useDebugStore((state) => state.luminance);
  const theme = useDebugStore((state) => state.colorScale);
  const [baseThemes, setBaseThemes] = useState<ThemeInfo[]>(
    generateBaseThemes(luminance, useDebugStore.getState().themeSettings),
  );
  const themeSettings = useDebugStore((state) => state.themeSettings);

  useEffect(() => {
    setBaseThemes(generateBaseThemes(luminance, themeSettings));
    console.log('ff');
  }, [themeSettings.base.modifier]);

  const testColorContrasts = (
    num1: number,
    num2: number,
    contrastLimit: number,
    mode: 'light' | 'dark',
  ) => {
    let passed = 0;
    for (let i = 0; i < baseThemes.length; i++) {
      const theme = baseThemes[i];
      const contrast = getContrastFromHex(
        theme[mode][num1].hex,
        theme[mode][num2].hex,
      );
      if (contrast > contrastLimit) {
        passed++;
      } else {
      }
    }
    return passed;
  };

  const Item = ({ text, text2, text3, error }: ItemProps) => {
    return (
      <div className={cl(classes.item)}>
        <div className={cl(classes.circle, error && classes.failed)}></div>
        <div className={classes.title}>{text}</div>
        {text2 && <div>{text2}</div>}
        {text3 && <div>{text3}</div>}
      </div>
    );
  };

  const renderTextDefault = (mode: 'light' | 'dark') => (
    <div key={mode + 'td'} className={classes.column}>
      <div className={classes.header}>
        <div>Text Default</div>
      </div>
      <div className={classes.items}>
        {[
          { index: 0, text: 'Background Default' },
          { index: 1, text: 'Background Tinted' },
          { index: 2, text: 'Surface Default' },
          { index: 3, text: 'Surface Hover' },
          { index: 4, text: 'Surface Active' },
        ].map(({ index, text }) => (
          <Item
            key={index}
            error={
              getContrastFromHex(
                theme[mode as keyof ThemeInfo][index].hex,
                theme[mode as keyof ThemeInfo][textDefaultIndex].hex,
              ) < 4.5
            }
            text={text}
            text2={'4.5:1'}
            text3={getContrastFromHex(
              theme[mode as keyof ThemeInfo][index].hex,
              theme[mode as keyof ThemeInfo][textDefaultIndex].hex,
            ).toFixed(1)}
          />
        ))}
      </div>
    </div>
  );

  const renderBorderDefault = (mode: 'light' | 'dark') => (
    <div
      key={mode + 'bd'}
      className={cl(classes.column, classes.borderDefault)}
    >
      <div className={classes.header}>
        <div>Border Default</div>
      </div>
      <div className={classes.items}>
        {[
          { index: 0, text: 'Background Default' },
          { index: 1, text: 'Background Subtle' },
        ].map(({ index, text }) => (
          <Item
            key={index}
            error={
              getContrastFromHex(
                theme[mode as keyof ThemeInfo][index].hex,
                theme[mode as keyof ThemeInfo][borderDefaultIndex].hex,
              ) < 3
            }
            text={text}
            text2={'3:1'}
            text3={getContrastFromHex(
              theme[mode as keyof ThemeInfo][index].hex,
              theme[mode as keyof ThemeInfo][textDefaultIndex].hex,
            ).toFixed(1)}
          />
        ))}
      </div>
    </div>
  );

  const renderBorderStrong = (mode: 'light' | 'dark') => (
    <div key={mode + 'bs'} className={classes.column}>
      <div className={classes.header}>
        <div>Border Strong</div>
      </div>
      <div className={classes.items}>
        {[
          { index: 0, text: 'Background Default' },
          { index: 1, text: 'Background Subtle' },
        ].map(({ index, text }) => (
          <Item
            key={index}
            error={
              getContrastFromHex(
                theme[mode as keyof ThemeInfo][index].hex,
                theme[mode as keyof ThemeInfo][borderStrongIndex].hex,
              ) < 4.5
            }
            text={text}
            text2={'4.5:1'}
            text3={getContrastFromHex(
              theme[mode as keyof ThemeInfo][index].hex,
              theme[mode as keyof ThemeInfo][borderStrongIndex].hex,
            ).toFixed(1)}
          />
        ))}
      </div>
    </div>
  );

  const renderContrastDefault = (mode: 'light' | 'dark') => {
    return (
      <div
        key={mode + 'cd'}
        className={cl(classes.column, classes.contrastDefault)}
      >
        <div className={classes.header}>
          <div>Contrast Default</div>
        </div>
        <div className={classes.items}>
          {[
            {
              baseIndex: baseDefaultIndex,
              text: 'Base Default',
              ratio: 4.5,
            },
            {
              baseIndex: baseHoverIndex,
              text: 'Base Hover',
              ratio: 4.5,
            },
            {
              baseIndex: baseActiveIndex,
              text: 'Base Active',
              ratio: 3,
            },
          ].map(({ baseIndex, text, ratio }) => (
            <Item
              key={text}
              error={
                testColorContrasts(
                  baseIndex,
                  baseContrastDefaultIndex,
                  ratio,
                  mode as 'light' | 'dark',
                ) !== 100
              }
              text={`${text}`}
              text2={`${ratio}:1`}
              text3={`${testColorContrasts(
                baseIndex,
                baseContrastDefaultIndex,
                ratio,
                mode as 'light' | 'dark',
              )} / 100`}
            />
          ))}
        </div>
      </div>
    );
  };

  const renderContrastSubtle = (mode: 'light' | 'dark') => (
    <div key={mode} className={classes.column}>
      <div className={classes.header}>
        <div>Contrast Subtle</div>
      </div>
      <div className={classes.items}>
        <Item
          error={
            testColorContrasts(
              baseDefaultIndex,
              baseContrastSubtleIndex,
              4.5,
              mode as 'light' | 'dark',
            ) !== 100
          }
          text='Base Default'
          text2='3:1'
          text3={
            testColorContrasts(
              baseDefaultIndex,
              baseContrastSubtleIndex,
              4.5,
              mode as 'light' | 'dark',
            ) === 100
              ? 'Tests passed'
              : 'Some tests failed'
          }
        />
      </div>
    </div>
  );

  return (
    <div className={classes.container}>
      <ColorScale />

      <div className={classes.panel}>
        <ContrastChecker />
      </div>
      <div className={classes.panel}>
        <ContrastChecker />
      </div>

      <div className={cl(classes.panel, classes.fullPanel)}>
        <div className={cl(classes.group)}>
          {renderTextDefault('light')} {renderBorderDefault('light')}
          {renderContrastDefault('light')} {renderContrastSubtle('light')}
          {renderBorderStrong('light')}
        </div>
      </div>
    </div>
  );
};
