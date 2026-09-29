import pc from 'picocolors';
import { severityColors } from '../../../schemas/defaults.ts';
import type { OutputFile } from '../../types.ts';
import { defaultFileHeader } from './theme.ts';

/** Creates type declarations for the given color names, e.g. from `getThemeColors` or a validated theme's `colors`. */
export const createTypes = (colors: string[]): OutputFile[] => {
  const typeDeclaration = createColorTypeDeclaration(colors);
  return [
    {
      output: `/* @deprecated: This file will be removed in a future release. Use types.d.ts instead */\n${typeDeclaration}`,
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
