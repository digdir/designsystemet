import { type ThemeObject, TokenSetStatus } from '@tokens-studio/types';

import type { ColorScheme } from '../../../colors/types.js';
import type { Colors, SizeModes, TokenSetDimensionsForAllThemes } from '../../types.js';

type FontsPerTheme = TokenSetDimensionsForAllThemes['fontNamesPerTheme'];

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

/**

* Generates the `$themes.json` file which is used by Token Studio to update Figma variable collections and modes.

* **IMPORTANT:**

* We use existing Figma variable ids to update existing collections/modes fetched from our published Figma community file.

* These are important for maintaining existing variables in user files when updating tokens.

* Omitting these ids results will result in the following bugs:
 - New collections/modes being created which may cause ghost variables in Figma.
 - New collections/modes may cause users hitting the cap on Figma variable modes which is at time of writing 4 (or unlimited for enterprise).

*/
export async function generate$Themes(
  tokenSetDimensions: TokenSetDimensionsForAllThemes,
  themeNames: string[],
): Promise<ThemeObject_[]> {
  const { colorSchemes, fontNamesPerTheme, sizeModes, colorsPerTheme } = tokenSetDimensions;
  const colors = colorsPerTheme[themeNames[0]]; // Get colors from the first theme as a representative for generating color groups, since they are expected to be the same across themes
  return [
    ...generateSizeGroups(themeNames, fontNamesPerTheme, sizeModes),
    ...(await generateThemeGroups(themeNames, fontNamesPerTheme)),
    ...generateTypographyGroup(themeNames),
    ...generateColorSchemeGroups(themeNames, colorSchemes),
    generateSemanticGroup(),
    ...(await generateColorGroups('main', colors)),
    ...(await generateColorGroups('support', colors)),
  ];
}

function generateSizeGroups(themeNames: string[], fonts: FontsPerTheme, sizeModes: SizeModes[]): ThemeObject_[] {
  const defaultSize = 'medium';
  const sizesWithDefaultFirst = [
    ...sizeModes.filter((x) => x === defaultSize),
    ...sizeModes.filter((x) => x !== defaultSize),
  ];
  const existingFigmaIds = {
    small: {
      id: '8b2c8cc86611a34b135cb22948666779361fd729',
      $figmaCollectionId: 'VariableCollectionId:36248:20757',
      $figmaModeId: '41630:3',
    },
    medium: {
      id: 'fb11567729c298ca37c9da4e3a27716a23480824',
      $figmaCollectionId: 'VariableCollectionId:36248:20757',
      $figmaModeId: '41630:1',
    },
    large: {
      id: 'd49b9eebeb48a4f165a74b7261733d0a73370f0e',
      $figmaCollectionId: 'VariableCollectionId:36248:20757',
      $figmaModeId: '41630:2',
    },
  };
  return sizesWithDefaultFirst.map((size) => ({
    name: size,
    group: 'Size',
    selectedTokenSets: {
      [`primitives/modes/size/${size}`]: TokenSetStatus.SOURCE,
      'primitives/modes/size/global': TokenSetStatus.ENABLED,
      ...Object.fromEntries(
        themeNames.flatMap(
          (theme) =>
            fonts[theme]?.flatMap((font) => [
              [`primitives/modes/size/global/${theme}/font-${font}`, TokenSetStatus.ENABLED],
              [`primitives/modes/size/${size}/${theme}/font-${font}`, TokenSetStatus.ENABLED],
            ]) ?? [],
        ),
      ),
    },
    ...existingFigmaIds[size],
    $figmaStyleReferences: {},
  }));
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

function generateColorSchemeGroups(themeNames: string[], colorSchemes: ColorSchemes): ThemeObject_[] {
  return colorSchemes.map(
    (scheme): ThemeObject_ => ({
      ...colorSchemeDefaults[scheme],
      selectedTokenSets: Object.fromEntries([
        ...themeNames.map((theme) => [`primitives/modes/color-scheme/${scheme}/${theme}`, TokenSetStatus.ENABLED]),
      ]),
      group: 'Color scheme',
    }),
  );
}

async function generateThemeGroups(themeNames: string[], fonts: FontsPerTheme): Promise<ThemeObject_[]> {
  return Promise.all(
    themeNames.map(
      async (theme, index): Promise<ThemeObject_> => ({
        id: await createHash(theme),
        $figmaCollectionId: 'VariableCollectionId:36528:61712',
        $figmaModeId: `40960:${index + 6}`, // Start on 6 in Token Studio and Community file for some reason
        name: theme,
        selectedTokenSets: {
          ...Object.fromEntries(
            fonts[theme]?.map((font) => [`primitives/fonts/${theme}/${font}`, TokenSetStatus.ENABLED]) ?? [],
          ),
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

async function generateColorGroups(group: 'main' | 'support', colors: Colors): Promise<ThemeObject_[]> {
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

function generateTypographyGroup(themeNames: string[]): ThemeObject_[] {
  return [
    {
      id: '368d753fcac4455f289500eaa42e70dc0a03522f',
      $figmaCollectionId: 'VariableCollectionId:36248:20769',
      $figmaModeId: '36248:2',
      name: 'Primary',
      selectedTokenSets: Object.fromEntries(
        themeNames.map((theme) => [`primitives/modes/typography/primary/${theme}`, TokenSetStatus.ENABLED]),
      ),
      group: 'Typography',
    },
    {
      id: '264b8bd1d40b364e1ea3acf09e49795ddd4c513c',
      $figmaCollectionId: 'VariableCollectionId:36248:20769',
      $figmaModeId: '36248:3',
      name: 'Secondary',
      selectedTokenSets: Object.fromEntries(
        themeNames.map((theme) => [`primitives/modes/typography/secondary/${theme}`, TokenSetStatus.ENABLED]),
      ),
      group: 'Typography',
    },
  ];
}
