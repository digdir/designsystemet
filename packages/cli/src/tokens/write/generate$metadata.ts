import type { ColorScheme } from '../../colors/types.js';
import type { Colors } from '../types.js';

type ColorSchemes = Array<ColorScheme>;

type Metadata = {
  tokenSetOrder: string[];
};

export function generateMetadataJson(schemes: ColorSchemes, themes: string[], colors: Colors): Metadata {
  return {
    tokenSetOrder: [
      'primitives/globals',
      'primitives/size/default',
      ...themes.map((theme) => `primitives/modes/typography/primary/${theme}`),
      ...themes.map((theme) => `primitives/modes/typography/secondary/${theme}`),
      ...schemes.flatMap((scheme) => [
        `primitives/modes/color-scheme/${scheme}/global`,
        ...themes.map((theme) => `primitives/modes/color-scheme/${scheme}/${theme}`),
      ]),
      ...themes.map((theme) => `themes/${theme}`),
      'semantic/color',
      ...Object.entries(colors.main).map(([color]) => `semantic/modes/main-color/${color}`),
      ...Object.entries(colors.support).map(([color]) => `semantic/modes/support-color/${color}`),
      'semantic/style',
      'Figma/components',
    ],
  };
}
