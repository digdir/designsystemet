import { randomUUID } from 'node:crypto';

import { type ThemeObject, TokenSetStatus } from '@tokens-studio/types';

import { normalizeTokenSetName } from './utils.js';

export default function generateThemesJson(
  modes: Array<'Light' | 'Dark' | 'Contrast'>,
  themes: string[],
): ThemeObject[] {
  return [...generateModesGroup(modes, themes), ...generateThemesGroup(themes), generateSemanticGroup()];
}

function generateModesGroup(modes: Array<'Light' | 'Dark' | 'Contrast'>, themes: string[]): ThemeObject[] {
  return modes.map(
    (mode): ThemeObject => ({
      id: randomUUID(),
      name: mode,
      selectedTokenSets: Object.fromEntries([
        [`primitives/colors/${normalizeTokenSetName(mode)}/global`, TokenSetStatus.ENABLED],
        ...themes.map(
          (theme) =>
            [
              `primitives/colors/${normalizeTokenSetName(mode)}/${normalizeTokenSetName(theme)}`,
              TokenSetStatus.ENABLED,
            ] as const,
        ),
      ]),
      group: 'Mode',
    }),
  );
}

function generateThemesGroup(themes: string[]): ThemeObject[] {
  return themes.map(
    (theme): ThemeObject => ({
      id: randomUUID(),
      name: theme,
      selectedTokenSets: {
        [`themes/${normalizeTokenSetName(theme)}`]: TokenSetStatus.ENABLED,
      },
      group: 'Theme',
    }),
  );
}

function generateSemanticGroup(): ThemeObject {
  return {
    id: randomUUID(),
    name: 'Semantic',
    selectedTokenSets: {
      'semantic/style': TokenSetStatus.ENABLED,
      'semantic/color': TokenSetStatus.ENABLED,
      'primitives/globals': TokenSetStatus.SOURCE,
      'primitives/typography/default': TokenSetStatus.SOURCE,
    },
    group: 'Semantic',
  };
}
