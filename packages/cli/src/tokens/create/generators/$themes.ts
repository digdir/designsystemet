import { type ThemeObject, TokenSetStatus } from '@tokens-studio/types';

import type { ColorScheme } from '../../../colors/types.js';
import type { Colors } from '../../types.js';

const capitalize = (word: string) => word.charAt(0).toUpperCase() + word.slice(1);

async function createHash(text: string, algo = 'SHA-1') {
  const crypto = globalThis.crypto;
  return Array.from(new Uint8Array(await crypto.subtle.digest(algo, new TextEncoder().encode(text))), (byte) =>
    byte.toString(16).padStart(2, '0'),
  ).join('');
}

type ColorSchemes = Array<ColorScheme>;

type ThemeObject_ = ThemeObject & {
  $figmaCollectionId?: string;
  $figmaModeId?: string;
  $figmaVariableReferences?: Record<string, string>;
};

export async function generate$Themes(
  colorSchemes: ColorSchemes,
  themes: string[],
  colors: Colors,
): Promise<ThemeObject_[]> {
  return [
    ...generateSizeGroup(),
    ...(await generateThemesGroup(themes)),
    ...generateTypographyGroup(themes),
    ...generateColorSchemesGroup(colorSchemes, themes),
    generateSemanticGroup(),
    ...(await generateColorGroup('main', colors)),
    ...(await generateColorGroup('support', colors)),
  ];
}

function generateSizeGroup(): ThemeObject_[] {
  return [
    {
      id: '8b2c8cc86611a34b135cb22948666779361fd729',
      name: 'medium',
      $figmaStyleReferences: {},
      selectedTokenSets: {
        'primitives/modes/size/medium': TokenSetStatus.SOURCE,
        'primitives/modes/size/global': TokenSetStatus.ENABLED,
        'primitives/modes/typography/size/medium': TokenSetStatus.ENABLED,
      },
      $figmaCollectionId: 'VariableCollectionId:36248:20757',
      $figmaModeId: '41630:1',
      group: 'Size',
    },
    {
      id: 'd49b9eebeb48a4f165a74b7261733d0a73370f0e',
      name: 'large',
      $figmaStyleReferences: {},
      selectedTokenSets: {
        'primitives/modes/size/large': TokenSetStatus.SOURCE,
        'primitives/modes/size/global': TokenSetStatus.ENABLED,
        'primitives/modes/typography/size/large': TokenSetStatus.ENABLED,
      },
      $figmaCollectionId: 'VariableCollectionId:36248:20757',
      $figmaModeId: '41630:2',
      group: 'Size',
    },
    {
      id: 'fb11567729c298ca37c9da4e3a27716a23480824',
      name: 'small',
      $figmaStyleReferences: {},
      selectedTokenSets: {
        'primitives/modes/size/small': TokenSetStatus.SOURCE,
        'primitives/modes/size/global': TokenSetStatus.ENABLED,
        'primitives/modes/typography/size/small': TokenSetStatus.ENABLED,
      },
      $figmaCollectionId: 'VariableCollectionId:36248:20757',
      $figmaModeId: '41630:3',
      group: 'Size',
    },
  ];
}

const colorSchemeDefaults: Record<ColorScheme, ThemeObject_> = {
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

function generateColorSchemesGroup(colorSchemes: ColorSchemes, themes: string[]): ThemeObject_[] {
  return colorSchemes.map(
    (scheme): ThemeObject_ => ({
      ...colorSchemeDefaults[scheme],
      selectedTokenSets: Object.fromEntries([
        [`primitives/modes/color-scheme/${scheme}/global`, TokenSetStatus.ENABLED],
        ...themes.map((theme) => [`primitives/modes/color-scheme/${scheme}/${theme}`, TokenSetStatus.ENABLED]),
      ]),
      group: 'Color scheme',
    }),
  );
}

async function generateThemesGroup(themes: string[]): Promise<ThemeObject_[]> {
  return Promise.all(
    themes.map(
      async (theme, index): Promise<ThemeObject_> => ({
        id: await createHash(theme),
        $figmaCollectionId: 'VariableCollectionId:36528:61712',
        $figmaModeId: `40960:${index + 6}`, // Start on 6 in Token Studio and Community file for some reason
        name: theme,
        selectedTokenSets: {
          [`themes/${theme}`]: TokenSetStatus.ENABLED,
        },
        group: 'Theme',
      }),
    ),
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
    $figmaCollectionId: 'VariableCollectionId:34811:5976',
    $figmaModeId: '34811:5',
    group: 'Semantic',
  };
}

async function generateColorGroup(group: 'main' | 'support', colors: Colors): Promise<ThemeObject_[]> {
  return Promise.all(
    Object.entries(colors[group]).map(
      async ([color]): Promise<ThemeObject_> => ({
        id: await createHash(`${group}-${color}`),
        name: color,
        selectedTokenSets: {
          [`semantic/modes/${group}-color/${color}`]: TokenSetStatus.ENABLED,
        },
        group: `${capitalize(group)} color`,
      }),
    ),
  );
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
