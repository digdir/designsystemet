import chalk from 'chalk';
import { buildOptions } from '../platform.js';
import { getCustomColors, type ProcessedThemeObject } from '../utils/getMultidimensionalThemes.js';

export const createTypeDeclarationFiles = (processed$themes: ProcessedThemeObject[]) => {
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
${colors.map((color) => `    ${color}: never;`).join('\n')}
  }
}
`.trimStart();

  return typeDeclaration;
}
