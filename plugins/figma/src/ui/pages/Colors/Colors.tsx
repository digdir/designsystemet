import type { CssColor } from '@adobe/leonardo-contrast-colors';
import type { ThemeInfo } from '@digdir/designsystemet/color';
import { generateThemeForColor } from '@digdir/designsystemet/color';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { Breadcrumbs } from '@ui/components/Breadcrumbs/Breadcrumbs';
import { ColorPicker } from '@ui/components/ColorPicker/ColorPicker';

import { getDummyTheme } from '../../../common/dummyTheme';
import type {
  ColorTheme,
  ThemeInfo as testThemeInfo,
} from '../../../common/store';
import { useThemeStore } from '../../../common/store';

import classes from './Colors.module.css';

const Tomato = (theme: ThemeInfo): testThemeInfo => {
  return {
    light: {
      1: theme.light[0].hex,
      2: theme.light[1].hex,
      3: theme.light[2].hex,
      4: theme.light[3].hex,
      5: theme.light[4].hex,
      6: theme.light[5].hex,
      7: theme.light[6].hex,
      8: theme.light[7].hex,
      9: theme.light[8].hex,
      10: theme.light[9].hex,
      11: theme.light[10].hex,
      12: theme.light[11].hex,
      13: theme.light[12].hex,
      'contrast-1': theme.light[13].hex,
      'contrast-2': theme.light[14].hex,
    },
    dark: {
      1: theme.dark[0].hex,
      2: theme.dark[1].hex,
      3: theme.dark[2].hex,
      4: theme.dark[3].hex,
      5: theme.dark[4].hex,
      6: theme.dark[5].hex,
      7: theme.dark[6].hex,
      8: theme.dark[7].hex,
      9: theme.dark[8].hex,
      10: theme.dark[9].hex,
      11: theme.dark[10].hex,
      12: theme.dark[11].hex,
      13: theme.dark[12].hex,
      'contrast-1': theme.dark[13].hex,
      'contrast-2': theme.dark[14].hex,
    },
    contrast: {
      1: theme.dark[0].hex,
      2: theme.dark[1].hex,
      3: theme.dark[2].hex,
      4: theme.dark[3].hex,
      5: theme.dark[4].hex,
      6: theme.dark[5].hex,
      7: theme.dark[6].hex,
      8: theme.dark[7].hex,
      9: theme.dark[8].hex,
      10: theme.dark[9].hex,
      11: theme.dark[10].hex,
      12: theme.dark[11].hex,
      13: theme.dark[12].hex,
      'contrast-1': theme.dark[13].hex,
      'contrast-2': theme.dark[14].hex,
    },
  };
};

function Colors() {
  const themes = useThemeStore((state) => state.themes);
  const [theme, setTheme] = useState<ColorTheme>(getDummyTheme());
  const [themeIndex, setThemeIndex] = useState<number>(0);
  const setThemes = useThemeStore((state) => state.setThemes);
  const { themeId } = useParams<string>();

  useEffect(() => {
    setThemeIndex(themes.findIndex((theme) => theme.themeModeId === themeId));
    setTheme(
      themes.find((theme) => theme.themeModeId === themeId)
        ?.colors as ColorTheme,
    );
  }, [themeId, themes]);

  return (
    <div className={classes.content}>
      <Breadcrumbs
        text={
          'Farger (' +
          themes.find((theme) => theme.themeModeId === themeId)?.name +
          ')'
        }
        url={'/themes/' + themeId}
      />
      <div className={classes.pickers}>
        <ColorPicker
          color={theme.accent.light?.[9] as CssColor}
          title='Accent'
          onColorChanged={(color: CssColor) => {
            const theme = generateThemeForColor(color);
            const numberTheme = Tomato(theme);
            const newArray = Array.from(themes);
            newArray[themeIndex] = {
              ...newArray[themeIndex],
              colors: {
                ...newArray[themeIndex].colors,
                accent: numberTheme,
              },
            };
            setThemes(newArray);
          }}
        />
        <ColorPicker
          color={theme.neutral.light?.[9] as CssColor}
          title='Neutral'
          onColorChanged={(color: CssColor) => {
            const theme = generateThemeForColor(color);
            const numberTheme = Tomato(theme);
            const newArray = Array.from(themes);
            newArray[themeIndex] = {
              ...newArray[themeIndex],
              colors: {
                ...newArray[themeIndex].colors,
                neutral: numberTheme,
              },
            };
            setThemes(newArray);
          }}
        />

        <ColorPicker
          color={theme.brand1.light?.[9] as CssColor}
          title='Brand 1'
          onColorChanged={(color: CssColor) => {
            const theme = generateThemeForColor(color);
            const numberTheme = Tomato(theme);
            const newArray = Array.from(themes);
            newArray[themeIndex] = {
              ...newArray[themeIndex],
              colors: {
                ...newArray[themeIndex].colors,
                brand1: numberTheme,
              },
            };
            setThemes(newArray);
          }}
        />
        <ColorPicker
          color={theme.brand2.light?.[9] as CssColor}
          title='Brand 2'
          onColorChanged={(color: CssColor) => {
            const theme = generateThemeForColor(color);
            const numberTheme = Tomato(theme);
            const newArray = Array.from(themes);
            newArray[themeIndex] = {
              ...newArray[themeIndex],
              colors: {
                ...newArray[themeIndex].colors,
                brand2: numberTheme,
              },
            };
            setThemes(newArray);
          }}
        />
        <ColorPicker
          color={theme.brand3.light?.[9] as CssColor}
          title='Brand 3'
          onColorChanged={(color: CssColor) => {
            const theme = generateThemeForColor(color);
            const numberTheme = Tomato(theme);
            const newArray = Array.from(themes);
            newArray[themeIndex] = {
              ...newArray[themeIndex],
              colors: {
                ...newArray[themeIndex].colors,
                brand3: numberTheme,
              },
            };
            setThemes(newArray);
          }}
        />
      </div>
    </div>
  );
}

export default Colors;
