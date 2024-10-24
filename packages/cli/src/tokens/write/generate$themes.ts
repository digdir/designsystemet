import crypto from 'node:crypto';

import { type ThemeObject, TokenSetStatus } from '@tokens-studio/types';

import type { ColorMode } from '../../colors/types.js';

const capitalize = (word: string) => word.charAt(0).toUpperCase() + word.slice(1);

const createHash = (text: string) => crypto.hash('sha1', text);

type ColorModes = Array<ColorMode>;

type ThemeObject_ = ThemeObject & {
  $figmaCollectionId?: string;
  $figmaModeId?: string;
};

export function generateThemesJson(modes: ColorModes, themes: string[]): ThemeObject_[] {
  return [
    ...generateSizeGroup(),
    ...generateThemesGroup(themes),
    ...generateTypographyGroup(themes),
    ...generateModesGroup(modes, themes),
    generateSemanticGroup(),
  ];
}

function generateSizeGroup(): ThemeObject_[] {
  return [
    {
      id: '8b2c8cc86611a34b135cb22948666779361fd729',
      name: 'Default',
      $figmaCollectionId: 'VariableCollectionId:36248:20757',
      selectedTokenSets: {
        'primitives/size/default': TokenSetStatus.ENABLED,
      },
      group: 'Size',
    },
  ];
}

const modeDefaults: Record<ColorMode, ThemeObject_> = {
  light: {
    name: 'Light',
    selectedTokenSets: {},
    id: '0daa3ca0b427b9349da7e7dc00101b5668972926',
    $figmaCollectionId: 'VariableCollectionId:34811:5472',
    $figmaModeId: '34811:0',
  },
  dark: {
    name: 'Dark',
    selectedTokenSets: {},
    id: '9ebd8aed52afbffc17e2666e8b4653a53498b257',
    $figmaCollectionId: 'VariableCollectionId:34811:5472',
    $figmaModeId: '34811:1',
  },
  contrast: {
    name: 'Contrast',
    selectedTokenSets: {},
    id: '9ebd8aed52afbffc17e2666e8b4653a53498b123',
    $figmaCollectionId: 'VariableCollectionId:34811:5472',
    $figmaModeId: '34811:2',
  },
};

function generateModesGroup(modes: Array<ColorMode>, themes: string[]): ThemeObject_[] {
  return modes.map(
    (mode): ThemeObject_ => ({
      ...modeDefaults[mode],
      selectedTokenSets: Object.fromEntries([
        [`primitives/modes/colors/${mode}/global`, TokenSetStatus.ENABLED],
        ...themes.map((theme) => [`primitives/modes/colors/${mode}/${theme}`, TokenSetStatus.ENABLED]),
      ]),
      group: 'Mode',
    }),
  );
}

function generateThemesGroup(themes: string[]): ThemeObject_[] {
  return themes.map(
    (theme, index): ThemeObject_ => ({
      id: createHash(theme),
      $figmaCollectionId: 'VariableCollectionId:36329:62335',
      $figmaModeId: `36329:${index + 4}`, // Start on 4 in Token Studio and Community file for some reason
      name: theme,
      selectedTokenSets: {
        [`themes/${theme}`]: TokenSetStatus.ENABLED,
      },
      group: 'Theme',
    }),
  );
}

function generateSemanticGroup(): ThemeObject_ {
  return {
    id: '541629445ef90ad5363f9e88f52a1ccb617e6f84',
    name: 'Semantic',
    selectedTokenSets: {
      'semantic/style': TokenSetStatus.ENABLED,
      'semantic/color': TokenSetStatus.ENABLED,
      'primitives/globals': TokenSetStatus.SOURCE,
    },
    group: 'Semantic',
  };
}

function generateTypographyGroup(themes: string[]): ThemeObject_[] {
  return [
    {
      id: '368d753fcac4455f289500eaa42e70dc0a03522f',
      $figmaCollectionId: 'VariableCollectionId:36248:20769',
      $figmaModeId: '36248:2',
      name: 'Primary',
      selectedTokenSets: Object.fromEntries(
        themes.map((theme) => [`primitives/modes/typography/primary/${theme}`, TokenSetStatus.ENABLED]),
      ),
      group: 'Typography',
    },
    {
      id: '264b8bd1d40b364e1ea3acf09e49795ddd4c513c',
      $figmaCollectionId: 'VariableCollectionId:36248:20769',
      $figmaModeId: '36248:3',
      name: 'Secondary',
      selectedTokenSets: Object.fromEntries(
        themes.map((theme) => [`primitives/modes/typography/secondary/${theme}`, TokenSetStatus.ENABLED]),
      ),
      group: 'Typography',
    },
  ];
}
