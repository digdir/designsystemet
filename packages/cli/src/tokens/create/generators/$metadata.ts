import type { ColorScheme } from '../../../colors/types.js';
import type { Colors, SizeModes } from '../../types.js';

type Metadata = {
  tokenSetOrder: string[];
};

export function generate$Metadata(
  schemes: ColorScheme[],
  themes: string[],
  colors: Colors,
  sizeModes: SizeModes[],
): Metadata {
  return {
    tokenSetOrder: [
      'primitives/globals',
      ...sizeModes.map((size) => `primitives/modes/size/${size}`),
      'primitives/modes/size/global',
      ...sizeModes.map((size) => `primitives/modes/typography/size/${size}`),
      ...themes.map((theme) => `primitives/modes/typography/primary/${theme}`),
      ...themes.map((theme) => `primitives/modes/typography/secondary/${theme}`),
      ...schemes.flatMap((scheme) => [...themes.map((theme) => `primitives/modes/color-scheme/${scheme}/${theme}`)]),
      ...themes.map((theme) => `themes/${theme}`),
      'semantic/color',
      ...Object.entries(colors.main).map(([color]) => `semantic/modes/main-color/${color}`),
      ...Object.entries(colors.support).map(([color]) => `semantic/modes/support-color/${color}`),
      'semantic/style',
    ],
  };
}
