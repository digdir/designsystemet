import type { OutputFile } from '../../types.ts';

export const createTailwindCSSFiles = (cssFiles: OutputFile[]): OutputFile[] => {
  console.log('\n🍱 Creating Tailwind Config');
  return cssFiles
    .map((file) => {
      if (file.destination) {
        const tailwindConfig = generateTailwind(file.output);
        const tailwindFile = {
          destination: file.destination.replace('.css', '.tailwind.css'),
          output: tailwindConfig,
        };
        return tailwindFile;
      }
      return undefined;
    })
    .filter((item) => item !== undefined);
};

const generateTailwind = (css: string): string => {
  const tailwind: string[] = ['--font-sans: var(--ds-font-family)'];
  const tokens = Array.from(new Set(css.match(/--ds-[^:)]+/g)), (m) => m).sort((a, b) =>
    a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }),
  );

  // Scrape tokens relevant for Tailwind
  for (const token of tokens) {
    if (token.startsWith('--ds-color-') && !token.startsWith('--ds-color-focus')) {
      tailwind.push(`--color-${token.replace('--ds-color-', '')}: var(${token})`);
    } else if (token.startsWith('--ds-opacity-')) {
      tailwind.push(`--opacity-${token.replace('--ds-opacity-', '')}: var(${token})`); // Sets --ds-opacity-disabled
    } else if (token.startsWith('--ds-shadow-')) {
      tailwind.push(`--shadow-${token.replace('--ds-shadow-', '')}: var(${token})`);
    } else if (token.startsWith('--ds-font-weight-')) {
      tailwind.push(`--font-weight-${token.replace('--ds-font-weight-', '')}: var(${token})`);
    } else if (token.match(/--ds-border-radius-(sm|md|lg|xl)/)) {
      // Not including "full" as this crashes with Tailwind
      tailwind.push(`--radius-${token.replace('--ds-border-radius-', '')}: var(${token})`);
    } else if (token.match(/--ds-body-(sm|mg|lg)-body-font-size/)) {
      tailwind.push(`--text-${token.replace('--ds-body-', '').replace('-font-size', '')}: var(${token})`);
    } else if (token.match(/^--ds-size-\d+$/)) {
      tailwind.push(`--spacing-${token.replace('--ds-size-', '')}: var(${token})`);
    }
  }

  /**
   * @see https://tailwindcss.com/docs/theme#referencing-other-variables
   */
  return `@theme inline {${tailwind.map((str) => `\n  ${str};`).join('')}\n}\n`;
};
