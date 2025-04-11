import type { ColorScheme } from '../../../colors/types.js';
import type { Colors } from '../../types.js';

type Metadata = {
  tokenSetOrder: string[];
};

export function generate$Metadata(schemes: ColorScheme[], themes: string[], colors: Colors): Metadata {
  return {
    tokenSetOrder: [
      'primitives/globals',
      'primitives/modes/size/small',
      'primitives/modes/size/medium',
      'primitives/modes/size/large',
      'primitives/modes/size/global',
      'primitives/modes/typography/size/small',
      'primitives/modes/typography/size/medium',
      'primitives/modes/typography/size/large',
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
    ],
  };
}
