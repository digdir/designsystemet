import { type ThemeObject, TokenSetStatus } from '@tokens-studio/types';

import type { ColorMode } from '../../colors/types.js';

const createHash = (text: string) => {
  let hash = 0;
  for (let i = 0; i < text.length; i += 1) {
    const chr = text.charCodeAt(i);
    hash = (hash << 5) - hash + chr;
    hash |= 0;
  }
  return (hash + 2147483648).toString(16);
};

type ColorModes = Array<ColorMode>;

export function generateThemesJson(modes: ColorModes, themes: string[]): ThemeObject[] {
  return [
    ...generateSizeGroup(),
    ...generateThemesGroup(themes),
    ...generateTypographyGroup(themes),
    ...generateModesGroup(modes, themes),
    generateSemanticGroup(),
  ];
}

function generateSizeGroup(): ThemeObject[] {
  return [
    {
      id: '8b2c8cc86611a34b135cb22948666779361fd729',
      name: 'default',
      selectedTokenSets: {
        'primitives/size/default': TokenSetStatus.ENABLED,
      },
      group: 'Size',
    },
  ];
}

const modeIds: Record<ColorMode, string> = {
  light: '0daa3ca0b427b9349da7e7dc00101b5668972926',
  dark: '9ebd8aed52afbffc17e2666e8b4653a53498b257',
  contrast: '9ebd8aed52afbffc17e2666e8b4653a53498b123',
};

function generateModesGroup(modes: Array<ColorMode>, themes: string[]): ThemeObject[] {
  return modes.map(
    (mode): ThemeObject => ({
      id: modeIds[mode],
      name: mode,
      selectedTokenSets: Object.fromEntries([
        [`primitives/modes/colors/${mode}/global`, TokenSetStatus.ENABLED],
        ...themes.map((theme) => [`primitives/modes/colors/${mode}/${theme}`, TokenSetStatus.ENABLED]),
      ]),
      group: 'Mode',
    }),
  );
}

function generateThemesGroup(themes: string[]): ThemeObject[] {
  return themes.map(
    (theme): ThemeObject => ({
      id: createHash(theme),
      name: theme,
      selectedTokenSets: {
        [`themes/${theme}`]: TokenSetStatus.ENABLED,
      },
      group: 'Theme',
    }),
  );
}

function generateSemanticGroup(): ThemeObject {
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

function generateTypographyGroup(themes: string[]): ThemeObject[] {
  return [
    {
      id: '368d753fcac4455f289500eaa42e70dc0a03522f',
      name: 'Primary',
      selectedTokenSets: Object.fromEntries(
        themes.map((theme) => [`primitives/modes/typography/primary/${theme}`, TokenSetStatus.ENABLED]),
      ),
      group: 'Typography',
    },
    {
      id: '264b8bd1d40b364e1ea3acf09e49795ddd4c513c',
      name: 'Secondary',
      selectedTokenSets: Object.fromEntries(
        themes.map((theme) => [`primitives/modes/typography/secondary/${theme}`, TokenSetStatus.ENABLED]),
      ),
      group: 'Typography',
    },
  ];
}
