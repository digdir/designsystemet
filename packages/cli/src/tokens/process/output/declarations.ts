import chalk from 'chalk';
import type { OutputFile } from '../../types.js';
import { buildOptions } from '../platform.js';
import { getCustomColors, type ProcessedThemeObject } from '../utils/getMultidimensionalThemes.js';

export const createTypeDeclarationFiles = (processed$themes: ProcessedThemeObject[]): OutputFile[] => {
  const colorGroups = buildOptions?.colorGroups || [];
  const customColors = getCustomColors(processed$themes, colorGroups);

  const typeDeclaration = createColorTypeDeclaration(customColors);
  return [
    {
      output: typeDeclaration,
      destination: 'colors.d.ts',
    },
  ];
};

function createColorTypeDeclaration(colors: string[]) {
  console.log(`\n🍱 Building ${chalk.green('type declarations')}`);

  const typeDeclaration = `
import type {} from '@digdir/designsystemet-react/colors';

declare module '@digdir/designsystemet-react/colors' {
  export interface MainAndSupportColors {
${colors.map((color) => `    '${color}': never;`).join('\n')}
  }
}
`.trimStart();

  return typeDeclaration;
}
