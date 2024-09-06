import type { ColorMode } from '../../colors/types.js';

type ColorModes = Array<ColorMode>;

type Metadata = {
  tokenSetOrder: string[];
};

export function generateMetadataJson(modes: ColorModes, themes: string[]): Metadata {
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
      'semantic/style',
      'Figma/components',
    ],
  };
}
