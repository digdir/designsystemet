import { normalizeTokenSetName } from './utils.js';

interface Metadata {
  tokenSetOrder: string[];
}

export default function generateMetadataJson(modes: Array<'Light' | 'Dark' | 'Contrast'>, themes: string[]): Metadata {
  return {
    tokenSetOrder: [
      'primitives/globals',
      'primitives/size/default',
      'primitives/modes/typography/primary/theme',
      'primitives/modes/typography/secondary/theme',
      ...modes.flatMap((mode) => [
        `primitives/modes/colors/${normalizeTokenSetName(mode)}/global`,
        ...themes.map(
          (theme) => `primitives/modes/colors/${normalizeTokenSetName(mode)}/${normalizeTokenSetName(theme)}`,
        ),
      ]),
      ...themes.map((theme) => `themes/${normalizeTokenSetName(theme)}`),
      'semantic/color',
      'semantic/style',
      'Figma/components',
    ],
  };
}
