import { randomUUID } from 'node:crypto';

import { type ThemeObject, TokenSetStatus } from '@tokens-studio/types';

import { normalizeTokenSetName } from './utils.js';

export default function generateThemesJson(
  modes: Array<'Light' | 'Dark' | 'Contrast'>,
  themes: string[],
): ThemeObject[] {
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
      id: randomUUID(),
      name: 'default',
      selectedTokenSets: {
        'primitives/size/default': TokenSetStatus.ENABLED,
      },
      group: 'Size',
    },
    {
      id: randomUUID(),
      name: 'compact',
      selectedTokenSets: {
        'primitives/size/compact': TokenSetStatus.ENABLED,
      },
      group: 'Size',
    },
  ];
}

function generateModesGroup(modes: Array<'Light' | 'Dark' | 'Contrast'>, themes: string[]): ThemeObject[] {
  return modes.map(
    (mode): ThemeObject => ({
      id: randomUUID(),
      name: mode,
      selectedTokenSets: Object.fromEntries([
        [`primitives/modes/colors/${normalizeTokenSetName(mode)}/global`, TokenSetStatus.ENABLED],
        ...themes.map(
          (theme) =>
            [
              `primitives/modes/colors/${normalizeTokenSetName(mode)}/${normalizeTokenSetName(theme)}`,
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
    },
    group: 'Semantic',
  };
}

function generateTypographyGroup(themes: string[]): ThemeObject[] {
  return [
    {
      id: randomUUID(),
      name: 'primary',
      selectedTokenSets: Object.fromEntries(
        themes.map((theme) => [
          `primitives/modes/typography/primary/${normalizeTokenSetName(theme)}`,
          TokenSetStatus.ENABLED,
        ]),
      ),
      group: 'Typography',
    },
    {
      id: randomUUID(),
      name: 'secondary',
      selectedTokenSets: Object.fromEntries(
        themes.map((theme) => [
          `primitives/modes/typography/secondary/${normalizeTokenSetName(theme)}`,
          TokenSetStatus.ENABLED,
        ]),
      ),
      group: 'Typography',
    },
  ];
}
