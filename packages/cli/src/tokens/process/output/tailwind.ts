import type { OutputFile } from '../../types.js';

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

  // Make [data-colors] dynamically change also Tailwind colors
  const dynamicColors = `[data-color] {
      --color-background-default: var(--ds-color-background-default);
      --color-background-tinted: var(--ds-color-background-tinted);
      --color-surface-default: var(--ds-color-surface-default);
      --color-surface-tinted: var(--ds-color-surface-tinted);
      --color-surface-hover: var(--ds-color-surface-hover);
      --color-surface-active: var(--ds-color-surface-active);
      --color-border-subtle: var(--ds-color-border-subtle);
      --color-border-default: var(--ds-color-border-default);
      --color-border-strong: var(--ds-color-border-strong);
      --color-text-subtle: var(--ds-color-text-subtle);
      --color-text-default: var(--ds-color-text-default);
      --color-base-default: var(--ds-color-base-default);
      --color-base-hover: var(--ds-color-base-hover);
      --color-base-active: var(--ds-color-base-active);
      --color-base-contrast-subtle: var(--ds-color-base-contrast-subtle);
      --color-base-contrast-default: var(--ds-color-base-contrast-default);
    }`;

  return `@theme {${tailwind.map((str) => `\n  ${str};`).join('')}\n}\n${dynamicColors}`;
};
