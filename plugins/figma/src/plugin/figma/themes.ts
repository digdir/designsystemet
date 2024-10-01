/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import { type ColorType, hexToRgb } from '@digdir/designsystemet/color';

import { getDummyFonts } from '../../common/dummyFonts';
import { getDummyTheme } from '../../common/dummyTheme';
import type { ColorIndex, ColorTheme, StoreThemes } from '../../common/store';
import { rgbToHex } from '../../common/utils';

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
        fonts: getDummyFonts(),
      });
    }
  }

  for (const variable of variables) {
    if (variable.variableCollectionId === modeColId) {
      const nameSplitArr = variable.name.split('/');

      const themeName = nameSplitArr[0] as string;
      const ThemeType = nameSplitArr[1] as ColorType;
      const ThemeIndex = nameSplitArr[2] as ColorIndex;

      if (themeName !== 'global' && modeColModes) {
        for (const mode of modeColModes) {
          const modeName = mode.name.toLocaleLowerCase() as
            | 'light'
            | 'dark'
            | 'contrast';

          const RGB = variable.valuesByMode[mode.modeId] as RGB;
          const HEX = rgbToHex(RGB);
          const theme = themes.find((theme) => theme.themeId === themeName);
          if (theme) theme.colors[ThemeType][modeName][ThemeIndex] = HEX;
        }
      }
    }
  }

  return themes;
};

export const addTheme = async (theme: ColorTheme, name: string) => {
  const collections = await figma.variables.getLocalVariableCollectionsAsync();
  let themeModeId = '';
  const modeCollection = collections.find(
    (collection) => collection.name === 'Mode',
  );

  for (const collection of collections) {
    if (collection.name === 'Theme') {
      themeModeId = collection.addMode(name);
    }
  }

  for (const [key] of Object.entries(theme.accent.light)) {
    if (modeCollection) {
      const types = ['accent', 'neutral', 'brand1', 'brand2', 'brand3'];
      for (const type of types) {
        const lightRGB = hexToRgb(
          theme[type as ColorType]['light'][key as ColorIndex],
          '1',
        );
        const darkRGB = hexToRgb(
          theme[type as ColorType]['dark'][key as ColorIndex],
          '1',
        );

        const variable = figma.variables.createVariable(
          name.toLocaleLowerCase() + '/' + type + '/' + key,
          modeCollection,
          'COLOR',
        );

        if (lightRGB && darkRGB) {
          variable.setValueForMode(modeCollection.modes[0].modeId, lightRGB);
          variable.setValueForMode(modeCollection.modes[1].modeId, darkRGB);
        }
      }
    }
  }

  const variables = await figma.variables.getLocalVariablesAsync('COLOR');
  for (const variable of variables) {
    if (variable.name.startsWith('color')) {
      const split = variable.name.split('/');
      const themeType = split[1];
      const themIndex = split[2];
      if (themIndex.length < 5) {
        const v = variables.find(
          (v) =>
            v.name ===
            name.toLocaleLowerCase() + '/' + themeType + '/' + themIndex,
        );
        if (v) {
          const alias = figma.variables.createVariableAlias(v);
          if (alias) {
            variable.setValueForMode(themeModeId, alias);
          }
        }
      }
    }
  }
};

export const deleteTheme = async (themeModeId: string, themeId: string) => {
  const collections = await figma.variables.getLocalVariableCollectionsAsync();
  const themeCollection = collections.find(
    (collection) => collection.name === 'Theme',
  );

  if (themeCollection) themeCollection.removeMode(themeModeId);

  const variables = await figma.variables.getLocalVariablesAsync('COLOR');
  for (const variable of variables) {
    if (variable.name.startsWith(themeId + '/')) {
      variable.remove();
    }
  }
};
export const renameTheme = async (
  newName: string,
  themeModeId: string,
  themeId: string,
) => {
  const collections = await figma.variables.getLocalVariableCollectionsAsync();

  const modeCollection = collections.find(
    (collection) => collection.name === 'Mode',
  );
  const themeCollection = collections.find(
    (collection) => collection.name === 'Theme',
  );
  const lightModeId = modeCollection?.modes[0].modeId;
  const darkModeId = modeCollection?.modes[1].modeId;

  if (themeCollection && newName) {
    themeCollection.renameMode(themeModeId, newName);
  }

  let variables = await figma.variables.getLocalVariablesAsync('COLOR');

  for (const variable of variables) {
    const nameSplitArr = variable.name.split('/');
    const ThemeType = nameSplitArr[1] as ColorType;
    const ThemeIndex = nameSplitArr[2] as ColorIndex;

    if (variable.name.startsWith(themeId + '/')) {
      let lightRGB = { r: 0, g: 0, b: 0 };
      let darkRGB = { r: 0, g: 0, b: 0 };

      for (const [key, value] of Object.entries(variable.valuesByMode)) {
        if (key === lightModeId) {
          lightRGB = value as RGB;
        } else if (key === darkModeId) {
          darkRGB = value as RGB;
        }
      }

      if (modeCollection) {
        const newVariable = figma.variables.createVariable(
          newName.toLocaleLowerCase() + '/' + ThemeType + '/' + ThemeIndex,
          modeCollection,
          'COLOR',
        );
        if (lightRGB && darkRGB) {
          newVariable.setValueForMode(modeCollection.modes[0].modeId, lightRGB);
          newVariable.setValueForMode(modeCollection.modes[1].modeId, darkRGB);
        }
      }
    }
  }

  variables = await figma.variables.getLocalVariablesAsync('COLOR');

  for (const variable of variables) {
    if (variable.name.startsWith('color')) {
      const split = variable.name.split('/');
      const themeType = split[1];
      const themIndex = split[2];
      if (themIndex.length < 5) {
        const v = variables.find(
          (v) =>
            v.name ===
            newName.toLocaleLowerCase() + '/' + themeType + '/' + themIndex,
        );
        if (v) {
          const alias = figma.variables.createVariableAlias(v);
          if (alias) {
            variable.setValueForMode(themeModeId, alias);
          }
        }
      }
    }
    if (variable.name.startsWith(themeId + '/')) {
      variable.remove();
    }
  }
};

export const updateTheme = async () => {
  const variables = await figma.variables.getLocalVariablesAsync('COLOR');
  const collections = await figma.variables.getLocalVariableCollectionsAsync();
  const modeCollection = collections.find((col) => col.name === 'Mode');
  const lightModeId = modeCollection?.modes[0].modeId;
  const themeCollection = collections.find((col) => col.name === 'Theme');
  const test = themeCollection?.modes[0].modeId;

  for (const variable of variables) {
    if (variable.name === 'digdir/brand1/3' && lightModeId) {
      variable.setValueForMode(lightModeId, { r: 0, g: 0, b: 0 });
    }
  }
  const v = variables.find((v) => v.name === 'color/brand1/3');
  const ve = variables.find((v) => v.name === 'digdir/brand1/3');
  if (v && ve && lightModeId && test) {
    const alias = figma.variables.createVariableAlias(ve);
    if (alias) {
      v.setValueForMode(test, alias);
    }
  }
};
