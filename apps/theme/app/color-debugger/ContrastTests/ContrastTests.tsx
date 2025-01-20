import { Button } from '@digdir/designsystemet-react';
import {
  type CssColor,
  type ThemeInfo,
  getContrastFromHex,
} from '@digdir/designsystemet/color';
import { CheckmarkIcon, XMarkIcon } from '@navikt/aksel-icons';
import chroma from 'chroma-js';
import cl from 'clsx/lite';
import { useEffect, useState } from 'react';
import {
  type LuminanceType,
  type ThemeSettingsType,
  useDebugStore,
} from '../debugStore';
import { generateColorSchemes } from '../logic/theme';
import classes from './ContrastTests.module.css';

type ItemProps = {
  text: string;
  text2?: string;
  error: boolean;
  circleText?: string;
};

const generateBaseThemes = (
  luminance: LuminanceType,
  themeSettings: ThemeSettingsType,
) => {
  const themes = [];
  for (let i = 0; i < 1000; i++) {
    const color = chroma('#0062BA')
      .luminance((i + 1) / 1000)
      .hex() as CssColor;
    themes.push(generateColorSchemes(color, luminance, themeSettings));
  }
  return themes;
};

export const ContrastTests = () => {
  const luminance = useDebugStore((state) => state.luminance);
  const theme = useDebugStore((state) => state.colorScale);
  const [baseThemes, setBaseThemes] = useState<ThemeInfo[]>([]);
  const themeSettings = useDebugStore((state) => state.themeSettings);

  useEffect(() => {
    setBaseThemes(generateBaseThemes(luminance, themeSettings));
  }, []);

  const onClicky = () => {
    setBaseThemes(generateBaseThemes(luminance, themeSettings));
  };

  const getContrastMessage = (
    num1: number,
    num2: number,
    contrastLimit: number,
    mode: 'light' | 'dark',
  ) => {
    return (
      'Minimum ' +
      contrastLimit +
      ':1 contrast. Value: ' +
      getContrastFromHex(theme.light[num1].hex, theme.light[num2].hex).toFixed(
        1,
      )
    );
  };

  const test = (
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

  const Item = ({ text, text2, error, circleText }: ItemProps) => {
    return (
      <div className={cl(classes.item)}>
        <div className={cl(classes.circle, error && classes.failed)}>
          {circleText && <div className={classes.circleText}>{circleText}</div>}
          {!circleText && (
            <>
              {!error && <CheckmarkIcon title='a11y-title' fontSize='1.7rem' />}
              {error && <XMarkIcon title='a11y-title' fontSize='1.7rem' />}
            </>
          )}
        </div>
        <div className={classes.textContainer}>
          <div className={classes.title}>{text}</div>
          {text2 && <div>{text2}</div>}
        </div>
      </div>
    );
  };

  const getCircleText = (
    theme: ThemeInfo,
    num1: number,
    num2: number,
    colorScheme: 'light' | 'dark',
  ) => {
    const contrast = getContrastFromHex(
      theme[colorScheme][num1].hex,
      theme[colorScheme][num2].hex,
    ).toFixed(1);
    if (contrast.length === 4) {
      return contrast.substring(0, contrast.length - 2);
    }
    return contrast;
  };

  return (
    <div className={classes.container}>
      <div className={classes.row}>
        <div className={classes.column}>
          <div className={classes.header}>
            <div>Text Default: Light mode</div>
          </div>
          <div className={classes.items}>
            <Item
              error={
                getContrastFromHex(theme.light[0].hex, theme.light[12].hex) <
                4.5
              }
              text='Background Default'
              text2={
                'Minimum 4.5:1 contrast. Value: ' +
                getContrastFromHex(
                  theme.light[0].hex,
                  theme.light[12].hex,
                ).toFixed(1)
              }
              circleText={getCircleText(theme, 0, 12, 'light')}
            />
            <Item
              error={
                getContrastFromHex(theme.light[1].hex, theme.light[12].hex) <
                4.5
              }
              text='Background Subtle'
              text2={getContrastMessage(1, 12, 4.5, 'light')}
              circleText={getCircleText(theme, 1, 12, 'light')}
            />
            <Item
              error={
                getContrastFromHex(theme.light[2].hex, theme.light[12].hex) <
                4.5
              }
              text='Surface Default'
              text2={getContrastMessage(2, 12, 4.5, 'light')}
              circleText={getCircleText(theme, 2, 12, 'light')}
            />
            <Item
              error={
                getContrastFromHex(theme.light[3].hex, theme.light[12].hex) <
                4.5
              }
              text='Surface Hover'
              text2={getContrastMessage(3, 12, 4.5, 'light')}
              circleText={getCircleText(theme, 3, 12, 'light')}
            />
            <Item
              error={
                getContrastFromHex(theme.light[4].hex, theme.light[12].hex) <
                4.5
              }
              text='Surface Active'
              text2={getContrastMessage(4, 12, 4.5, 'light')}
              circleText={getCircleText(theme, 4, 12, 'light')}
            />
          </div>
        </div>
        <div className={classes.column}>
          <div className={classes.header}>
            <div>Text Default: Dark</div>
          </div>
          <div className={classes.items}>
            <Item
              error={
                getContrastFromHex(theme.dark[0].hex, theme.dark[12].hex) < 4.5
              }
              text='Background Default'
              text2={getContrastMessage(0, 12, 4.5, 'dark')}
              circleText={getCircleText(theme, 0, 12, 'dark')}
            />
            <Item
              error={
                getContrastFromHex(theme.dark[1].hex, theme.dark[12].hex) < 4.5
              }
              text='Background Subtle'
              text2={getContrastMessage(1, 12, 4.5, 'dark')}
              circleText={getCircleText(theme, 1, 12, 'dark')}
            />
            <Item
              error={
                getContrastFromHex(theme.dark[2].hex, theme.dark[12].hex) < 4.5
              }
              text='Surface Default'
              text2={getContrastMessage(2, 12, 4.5, 'dark')}
              circleText={getCircleText(theme, 2, 12, 'dark')}
            />
            <Item
              error={
                getContrastFromHex(theme.dark[3].hex, theme.dark[12].hex) < 4.5
              }
              text='Surface Hover'
              text2={getContrastMessage(3, 12, 4.5, 'dark')}
              circleText={getCircleText(theme, 3, 12, 'dark')}
            />
            <Item
              error={
                getContrastFromHex(theme.dark[4].hex, theme.dark[12].hex) < 4.5
              }
              text='Surface Active'
              text2={getContrastMessage(4, 12, 4.5, 'dark')}
              circleText={getCircleText(theme, 4, 12, 'dark')}
            />
          </div>
        </div>
      </div>
      <div className={classes.row}>
        <div className={classes.column}>
          <div className={classes.header}>
            <div>Border Default: Light mode</div>
          </div>
          <div className={classes.items}>
            <Item
              error={
                getContrastFromHex(theme.light[0].hex, theme.light[6].hex) < 3
              }
              text='Background Default'
              text2={getContrastMessage(0, 6, 3, 'light')}
              circleText={getCircleText(theme, 0, 6, 'light')}
            />
            <Item
              error={
                getContrastFromHex(theme.light[1].hex, theme.light[6].hex) < 3
              }
              text='Background Subtle'
              text2={getContrastMessage(1, 6, 3, 'light')}
              circleText={getCircleText(theme, 1, 6, 'light')}
            />
          </div>
        </div>
        <div className={classes.column}>
          <div className={classes.header}>
            <div>Border Default: Dark mode</div>
          </div>
          <div className={classes.items}>
            <Item
              error={
                getContrastFromHex(theme.dark[0].hex, theme.dark[6].hex) < 3
              }
              text='Background Default'
              text2={getContrastMessage(0, 6, 3, 'dark')}
              circleText={getCircleText(theme, 0, 6, 'dark')}
            />
            <Item
              error={
                getContrastFromHex(theme.dark[1].hex, theme.dark[6].hex) < 3
              }
              text='Background Subtle'
              text2={getContrastMessage(1, 6, 3, 'dark')}
              circleText={getCircleText(theme, 1, 6, 'dark')}
            />
          </div>
        </div>
      </div>
      <div className={classes.row}>
        <div className={classes.column}>
          <div className={classes.header}>
            <div>Border Strong: Light mode</div>
          </div>
          <div className={classes.items}>
            <Item
              error={
                getContrastFromHex(theme.dark[0].hex, theme.dark[7].hex) < 4.5
              }
              text='Background Default'
              text2={getContrastMessage(0, 7, 4.5, 'light')}
              circleText={getCircleText(theme, 0, 7, 'light')}
            />
            <Item
              error={
                getContrastFromHex(theme.dark[1].hex, theme.dark[7].hex) < 4.5
              }
              text='Background Subtle'
              text2={getContrastMessage(1, 7, 4.5, 'light')}
              circleText={getCircleText(theme, 1, 7, 'light')}
            />
          </div>
        </div>
        <div className={classes.column}>
          <div className={classes.header}>
            <div>Border Strong: Dark mode</div>
          </div>
          <div className={classes.items}>
            <Item
              error={
                getContrastFromHex(theme.dark[0].hex, theme.dark[7].hex) < 4.5
              }
              text='Background Default'
              text2={getContrastMessage(0, 7, 4.5, 'dark')}
              circleText={getCircleText(theme, 0, 7, 'dark')}
            />
            <Item
              error={
                getContrastFromHex(theme.dark[1].hex, theme.dark[7].hex) < 4.5
              }
              text='Background Subtle'
              text2={getContrastMessage(1, 7, 4.5, 'dark')}
              circleText={getCircleText(theme, 1, 7, 'dark')}
            />
          </div>
        </div>
      </div>
      <div className={classes.row}>
        <div className={classes.column}>
          <div className={classes.header}>
            <div>Contrast Default: Light mode</div>
            <Button
              data-size='sm'
              variant='secondary'
              className={classes.btn}
              onClick={onClicky}
            >
              Run tests
            </Button>
          </div>
          <div className={classes.items}>
            <Item
              error={test(8, 13, 4.5, 'light') < 1000}
              text='4.5:1 contrast against Base Default'
              text2={test(8, 13, 4.5, 'light') + ' / 1000 tests passed'}
            />
            <Item
              error={test(9, 13, 4.5, 'light') < 1000}
              text='4.5:1 contrast against Base Hover'
              text2={test(9, 13, 4.5, 'light') + ' / 1000 tests passed'}
            />
            <Item
              error={test(8, 13, 3, 'light') < 1000}
              text='3:1 contrast against Base Active'
              text2={test(8, 13, 3, 'light') + ' / 1000 tests passed'}
            />
          </div>
        </div>
        <div className={classes.column}>
          <div className={classes.header}>
            <div>Contrast Default: Dark mode</div>
            <Button
              data-size='sm'
              variant='secondary'
              className={classes.btn}
              onClick={onClicky}
            >
              Run tests
            </Button>
          </div>
          <div className={classes.items}>
            <Item
              error={test(8, 13, 4.5, 'dark') < 1000}
              text='4.5:1 contrast against Base Default'
              text2={test(8, 13, 4.5, 'dark') + ' / 1000 tests passed'}
            />
            <Item
              error={test(9, 13, 4.5, 'dark') < 1000}
              text='4.5:1 contrast against Base Hover'
              text2={test(9, 13, 4.5, 'dark') + ' / 1000 tests passed'}
            />
            <Item
              error={test(10, 13, 3, 'dark') < 1000}
              text='3:1 contrast against Base Active'
              text2={test(10, 13, 3, 'dark') + ' / 1000 tests passed'}
            />
          </div>
        </div>
      </div>
      <div className={classes.row}>
        <div className={classes.column}>
          <div className={classes.header}>
            <div>Contrast Subtle: Light mode</div>
            <Button
              data-size='sm'
              variant='secondary'
              className={classes.btn}
              onClick={onClicky}
            >
              Run tests
            </Button>
          </div>
          <div className={classes.items}>
            <Item
              error={test(8, 14, 4.5, 'light') < 1000}
              text='4.5:1 contrast against Base Default'
              text2={test(8, 14, 4.5, 'light') + ' / 1000 tests passed'}
            />
          </div>
        </div>
        <div className={classes.column}>
          <div className={classes.header}>
            <div>Contrast Subtle: Dark mode</div>
            <Button
              data-size='sm'
              variant='secondary'
              className={classes.btn}
              onClick={onClicky}
            >
              Run tests
            </Button>
          </div>
          <div className={classes.items}>
            <Item
              error={test(8, 14, 4.5, 'dark') < 1000}
              text='4.5:1 contrast against Base Default'
              text2={test(8, 14, 4.5, 'dark') + ' / 1000 tests passed'}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
