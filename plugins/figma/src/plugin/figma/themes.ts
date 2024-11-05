import { rgbToHex } from '@digdir/designsystemet/color';
import { getDummyTheme } from '../../common/dummyTheme';
import type { StoreThemes } from '../../common/store';

export const getThemes = async () => {
  const collections = await figma.variables.getLocalVariableCollectionsAsync();
  const modeColModes = collections.find(
    (collection) => collection.name === 'Mode',
  )?.modes;
  const themeModes = collections.find(
    (collection) => collection.name === 'Theme',
  )?.modes;
  const modeColId = collections.find(
    (collection) => collection.name === 'Mode',
  )?.id;

  const variables = await figma.variables.getLocalVariablesAsync('COLOR');

  const themes: StoreThemes = [];

  if (themeModes) {
    for (const themeMode of themeModes) {
      themes.push({
        name: themeMode.name,
        themeId: themeMode.name.toLowerCase(),
        themeModeId: themeMode.modeId,
        colors: getDummyTheme(),
      });
    }
  }

  for (const variable of variables) {
    if (variable.variableCollectionId === modeColId) {
      const nameSplitArr = variable.name.split('/');

      const themeName = nameSplitArr[0] as string;
      const ThemeType = nameSplitArr[1] as string;
      const ThemeIndex = nameSplitArr[2] as string;

      if (themeName !== 'global' && modeColModes) {
        for (const mode of modeColModes) {
          const modeName = mode.name.toLocaleLowerCase() as
            | 'light'
            | 'dark'
            | 'contrast';

          const RGB = variable.valuesByMode[mode.modeId] as RGB;
          const HEX = rgbToHex(RGB);
          const theme = themes.find((theme) => theme.themeId === themeName);
          if (theme)
            (
              theme.colors as Record<
                string,
                Record<string, Record<string, string>>
              >
            )[ThemeType][modeName][ThemeIndex] = HEX;
        }
      }
    }
  }

  return themes;
};
