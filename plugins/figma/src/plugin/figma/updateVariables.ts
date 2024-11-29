import { hexToRgb, rgbToHex } from '@digdir/designsystemet/color';

import type { ColorIndex, StoreTheme } from '../../common/store';
import type { FigmaModeName, ThemeColors } from '../../common/types';

const updateColors = (
  theme: StoreTheme,
  variable: Variable,
  lightModeId: string,
  darkModeId: string,
  modeCollection: VariableCollection,
) => {
  const themeName = variable.name.split('/')[0] as FigmaModeName;
  const themeType = variable.name.split('/')[1] as ThemeColors;
  const themeIndex = variable.name.split('/')[2] as ColorIndex;

  if (
    variable.variableCollectionId === modeCollection.id &&
    !variable.name.startsWith('global')
  ) {
    const oldLightHex = rgbToHex(variable.valuesByMode[lightModeId] as RGB);
    const newLightHex = theme.colors[themeType].light[themeIndex];
    const oldDarkHex = rgbToHex(variable.valuesByMode[darkModeId] as RGB);
    const newDarkHex = theme.colors[themeType].dark[themeIndex];

    if (newLightHex && oldLightHex !== newLightHex) {
      const lightRGB = hexToRgb(newLightHex, '1');
      if (lightRGB) {
        variable.setValueForMode(lightModeId, lightRGB);
      }
    }
    if (newDarkHex && oldDarkHex !== newDarkHex) {
      const darkRGB = hexToRgb(newDarkHex, '1');
      if (darkRGB) {
        variable.setValueForMode(darkModeId, darkRGB);
      }
    }
  }
};

export const updateVariables = async (theme: StoreTheme) => {
  console.log({ theme });
  const collections = await figma.variables.getLocalVariableCollectionsAsync();
  const modeCollection = collections.find((col) => col.name === 'Color scheme');
  const themeCollection = collections.find((col) => col.name === 'Theme');

  console.log('theme', theme);
  console.log({ modeCollection, themeCollection });

  const vars = figma.variables.getVariableCollectionById(theme.themeId);
  console.log({ vars });

  if (modeCollection && themeCollection) {
    let lightModeId = '';
    let darkModeId = '';

    for (const mode of modeCollection.modes) {
      if (mode.name === 'Light') {
        lightModeId = mode.modeId;
      } else if (mode.name === 'Dark') {
        darkModeId = mode.modeId;
      }
    }
    const variables = await figma.variables.getLocalVariablesAsync('COLOR');

    const filteredVariables = variables.filter((variable) => {
      const themeName = variable.name.split('/')[0] as FigmaModeName;
      return themeName === theme.themeModeId;
    });

    console.log({ filteredVariables });

    try {
      for (const variable of filteredVariables) {
        updateColors(theme, variable, lightModeId, darkModeId, modeCollection);
      }
      figma.ui.postMessage({ type: 'updateVariables' });
    } catch (error) {
      console.error(error);
      figma.ui.postMessage({ type: 'setValueForModeError' });
    }
  }
};
