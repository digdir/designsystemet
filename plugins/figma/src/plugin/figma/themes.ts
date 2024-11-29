import { rgbToHex } from '@digdir/designsystemet/color';
import { getDummyTheme } from '../../common/dummyTheme';
import type { StoreThemes } from '../../common/store';

export const getThemes = async () => {
  const collections = (
    await figma.variables.getLocalVariableCollectionsAsync()
  ).filter((collection) => {
    return collection.name === 'Color scheme' || collection.name === 'Theme';
  });
  console.log({ collections });
  const modeColModes = collections.find(
    (collection) => collection.name === 'Color scheme',
  )?.modes;
  const themeModes = collections.find(
    (collection) => collection.name === 'Theme',
  )?.modes;
  const modeColId = collections.find(
    (collection) => collection.name === 'Color scheme',
  )?.id;

  const variables = await figma.variables.getLocalVariablesAsync('COLOR');

  const themes: StoreThemes = [];

  console.log({ collections, variables, modeColModes, themeModes, modeColId });

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

  console.log('first variable', variables[0]);

  for (const variable of variables) {
    if (variable.variableCollectionId === modeColId) {
      const nameSplitArr = variable.name.split('/');

      const themeName = nameSplitArr[0] as string;
      const ThemeType = nameSplitArr[1] as string;
      const ThemeIndex = nameSplitArr[2] as string;

      /* console.log({ themeName, ThemeType, ThemeIndex }); */

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

  console.log({ themes });

  return themes;
};
