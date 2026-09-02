import { type ThemeObject, TokenSetStatus } from '@tokens-studio/types';

import type { ColorScheme } from '../../../colors/types.ts';
import type { SizeModes, TokenSetDimensions } from '../../types.ts';

async function createHash(text: string, algo = 'SHA-1') {
  const crypto = globalThis.crypto;
  if (!crypto?.subtle) {
    console.warn('Crypto API not available; using deterministic fallback hash. This may still result in collisions.');
    let hash = 2166136261;
    for (let i = 0; i < text.length; i++) {
      hash ^= text.charCodeAt(i);
      hash = Math.imul(hash, 16777619);
    }
    return Promise.resolve(hash.toString(16).padStart(8, '0'));
  }

  return Array.from(new Uint8Array(await crypto.subtle.digest(algo, new TextEncoder().encode(text))), (byte) =>
    byte.toString(16).padStart(2, '0'),
  ).join('');
}

type ColorSchemes = Array<ColorScheme>;

export type ThemeObject_ = ThemeObject & {
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
 - New collections/modes may cause users hitting the cap on Figma variable modes which is at time of writing 10 (or unlimited for enterprise).

*/
export async function generate$Themes(
  tokenSetDimensions: TokenSetDimensions,
  themeNames: string[],
  colorNames: string[],
): Promise<ThemeObject_[]> {
  const { colorSchemes, sizeModes, typographies } = tokenSetDimensions;
  return [
    ...(await generateSizeGroup(sizeModes)),
    ...(await generateThemesGroup(themeNames)),
    ...(await generateTypographyGroup(themeNames, typographies)),
    ...generateColorSchemesGroup(colorSchemes, themeNames),
    generateSemanticGroup(),
    ...(await generateColorGroup(colorNames)),
  ];
}

/** Known Figma ids for the default size modes, see the doc comment on {@link generate$Themes} */
const sizeGroupDefaults: Record<string, { id: string; $figmaModeId: string }> = {
  medium: {
    id: '8b2c8cc86611a34b135cb22948666779361fd729',
    $figmaModeId: '41630:1',
  },
  large: {
    id: 'd49b9eebeb48a4f165a74b7261733d0a73370f0e',
    $figmaModeId: '41630:2',
  },
  small: {
    id: 'fb11567729c298ca37c9da4e3a27716a23480824',
    $figmaModeId: '41630:3',
  },
};

async function generateSizeGroup(sizeModes: SizeModes[]): Promise<ThemeObject_[]> {
  // Keep the historical order of the default modes, followed by any custom modes in config order.
  const modes: string[] = sizeModes;
  const orderedModes = [
    ...Object.keys(sizeGroupDefaults).filter((mode) => modes.includes(mode)),
    ...modes.filter((mode) => !(mode in sizeGroupDefaults)),
  ];

  return Promise.all(
    orderedModes.map(async (mode): Promise<ThemeObject_> => {
      const defaults = sizeGroupDefaults[mode];

      return {
        id: defaults?.id ?? (await createHash(mode)),
        name: mode,
        $figmaStyleReferences: {},
        selectedTokenSets: {
          [`primitives/modes/size/${mode}`]: TokenSetStatus.SOURCE,
          'primitives/modes/size/global': TokenSetStatus.ENABLED,
          [`primitives/modes/typography/size/${mode}`]: TokenSetStatus.ENABLED,
        },
        $figmaCollectionId: 'VariableCollectionId:36248:20757',
        $figmaModeId: defaults?.$figmaModeId,
        group: 'Size',
      };
    }),
  );
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
};

function generateColorSchemesGroup(colorSchemes: ColorSchemes, themes: string[]): ThemeObject_[] {
  return colorSchemes.map(
    (scheme): ThemeObject_ => ({
      ...colorSchemeDefaults[scheme],
      selectedTokenSets: Object.fromEntries([
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
      'primitives/globals': TokenSetStatus.SOURCE,
    },
    $figmaCollectionId: 'VariableCollectionId:34811:5976',
    $figmaModeId: '34811:5',
    group: 'Semantic',
  };
}

async function generateColorGroup(colorNames: string[]): Promise<ThemeObject_[]> {
  return Promise.all(
    colorNames.map(
      async (color): Promise<ThemeObject_> => ({
        id: await createHash(color),
        name: color,
        selectedTokenSets: {
          [`semantic/color/${color}`]: TokenSetStatus.ENABLED,
        },
        group: `Color`,
      }),
    ),
  );
}

/** Known Figma ids for the default typography sets, see the doc comment on {@link generate$Themes} */
const typographyGroupDefaults: Record<string, { id: string; $figmaModeId: string }> = {
  primary: {
    id: '368d753fcac4455f289500eaa42e70dc0a03522f',
    $figmaModeId: '36248:2',
  },
  secondary: {
    id: '264b8bd1d40b364e1ea3acf09e49795ddd4c513c',
    $figmaModeId: '36248:3',
  },
};

async function generateTypographyGroup(themes: string[], typographies: string[]): Promise<ThemeObject_[]> {
  return Promise.all(
    typographies.map(async (typography): Promise<ThemeObject_> => {
      const defaults = typographyGroupDefaults[typography];

      return {
        id: defaults?.id ?? (await createHash(typography)),
        $figmaCollectionId: 'VariableCollectionId:36248:20769',
        $figmaModeId: defaults?.$figmaModeId,
        name: typography.charAt(0).toUpperCase() + typography.slice(1),
        selectedTokenSets: Object.fromEntries(
          themes.map((theme) => [`primitives/modes/typography/${typography}/${theme}`, TokenSetStatus.ENABLED]),
        ),
        group: 'Typography',
      };
    }),
  );
}
