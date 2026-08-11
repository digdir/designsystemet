import pc from 'picocolors';
import { severityColors } from '../../../schemas/defaults.ts';
import type { OutputFile } from '../../types.ts';
import { getThemeColors, type ProcessedThemeObject } from '../utils/getMultidimensionalThemes.ts';
import { defaultFileHeader } from './theme.ts';

export const createTypeDeclarationFiles = (processed$themes: ProcessedThemeObject[]): OutputFile[] => {
  const colors = getThemeColors(processed$themes);
  const typeDeclaration = createColorTypeDeclaration(colors);
  return [
    {
      output: `/* This file is deprecated and will be removed in a future release. Use types.d.ts instead */\n${typeDeclaration}`,
      destination: 'colors.d.ts',
    },
    {
      output: typeDeclaration,
      destination: 'types.d.ts',
    },
  ];
};

function createColorTypeDeclaration(colors: string[]) {
  console.log(`\n🍱 Building ${pc.green('type declarations')}`);

  const severityColorNames = Object.keys(severityColors);
  const colorsWithoutSeverity = colors.filter((color) => !severityColorNames.includes(color));

  const typeDeclaration = `
/* ${defaultFileHeader} */
import type {} from '@digdir/designsystemet-types';

// Augment types based on theme
declare module '@digdir/designsystemet-types' {
  export interface ColorDefinitions {
${colorsWithoutSeverity.map((color) => `    ${color.includes('-') ? `'${color}'` : color}: never;`).join('\n')}
  }
  export interface SeverityColorDefinitions {
${severityColorNames.map((color) => `    ${color}: never;`).join('\n')}
  }
}
`.trimStart();

  return typeDeclaration;
}
