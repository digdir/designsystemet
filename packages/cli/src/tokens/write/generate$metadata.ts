import type { ColorMode } from '../../colors/types.js';
import type { Colors } from '../types.js';

type ColorModes = Array<ColorMode>;

type Metadata = {
  tokenSetOrder: string[];
};

export function generateMetadataJson(modes: ColorModes, themes: string[], colors: Colors): Metadata {
  return {
    tokenSetOrder: [
      'primitives/globals',
      'primitives/size/default',
      ...themes.map((theme) => `primitives/modes/typography/primary/${theme}`),
      ...themes.map((theme) => `primitives/modes/typography/secondary/${theme}`),
      ...modes.flatMap((mode) => [
        `primitives/modes/colors/${mode}/global`,
        ...themes.map((theme) => `primitives/modes/colors/${mode}/${theme}`),
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
