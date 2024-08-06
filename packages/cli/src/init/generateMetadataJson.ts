import { normalizeTokenSetName } from './utils.js';

interface Metadata {
  tokenSetOrder: string[];
}

export default function generateMetadataJson(modes: Array<'Light' | 'Dark' | 'Contrast'>, themes: string[]): Metadata {
  return {
    tokenSetOrder: [
      'primitives/globals',
      'primitives/typography/default',
      ...modes.flatMap((mode) => [
        `primitives/colors/${normalizeTokenSetName(mode)}/global`,
        ...themes.map((theme) => `primitives/colors/${normalizeTokenSetName(mode)}/${normalizeTokenSetName(theme)}`),
      ]),
      ...themes.map((theme) => `themes/${normalizeTokenSetName(theme)}`),
      'semantic/color',
      'semantic/style',
    ],
  };
}
