import type { OutputFile } from '../../types.ts';

/** Tailwind CSS major versions a theme file can be generated for. */
export type TailwindVersion = 'v3' | 'v4';

/** Tailwind theme namespaces, mapped to their CSS variable prefix */
const namespaces = {
  color: '--color-',
  opacity: '--opacity-',
  shadow: '--shadow-',
  fontWeight: '--font-weight-',
  radius: '--radius-',
  text: '--text-',
  spacing: '--spacing-',
} as const;

type TailwindToken = { namespace: keyof typeof namespaces; key: string; token: string };

export const createTailwindCSSFiles = (cssFiles: OutputFile[], version: TailwindVersion): OutputFile[] => {
  console.log(`\n🍱 Creating Tailwind ${version} Config`);
  return cssFiles
    .map((file) => {
      if (file.destination) {
        const tokens = scrapeTailwindTokens(file.output);
        const tailwindFile = {
          destination: file.destination.replace('.css', '.tailwind.css'),
          output: version === 'v3' ? generateTailwindV3(tokens) : generateTailwindV4(tokens),
        };
        return tailwindFile;
      }
      return undefined;
    })
    .filter((item) => item !== undefined);
};

/** Scrapes the tokens relevant for Tailwind from the theme CSS */
const scrapeTailwindTokens = (css: string): TailwindToken[] => {
  const tailwind: TailwindToken[] = [];
  const tokens = Array.from(new Set(css.match(/--ds-[^:)]+/g)), (m) => m).sort((a, b) =>
    a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }),
  );

  for (const token of tokens) {
    if (token.startsWith('--ds-color-') && !token.startsWith('--ds-color-focus')) {
      tailwind.push({ namespace: 'color', key: token.replace('--ds-color-', ''), token });
    } else if (token.startsWith('--ds-opacity-')) {
      tailwind.push({ namespace: 'opacity', key: token.replace('--ds-opacity-', ''), token }); // Sets --ds-opacity-disabled
    } else if (token.startsWith('--ds-shadow-')) {
      tailwind.push({ namespace: 'shadow', key: token.replace('--ds-shadow-', ''), token });
    } else if (token.startsWith('--ds-font-weight-')) {
      tailwind.push({ namespace: 'fontWeight', key: token.replace('--ds-font-weight-', ''), token });
    } else if (token.match(/--ds-border-radius-(sm|md|lg|xl)/)) {
      // Not including "full" as this crashes with Tailwind
      tailwind.push({ namespace: 'radius', key: token.replace('--ds-border-radius-', ''), token });
    } else if (token.match(/--ds-body-(sm|mg|lg)-body-font-size/)) {
      tailwind.push({ namespace: 'text', key: token.replace('--ds-body-', '').replace('-font-size', ''), token });
    } else if (token.match(/^--ds-size-\d+$/)) {
      tailwind.push({ namespace: 'spacing', key: token.replace('--ds-size-', ''), token });
    }
  }

  return tailwind;
};

const toThemeVariables = (tokens: TailwindToken[]): string =>
  [
    '--font-sans: var(--ds-font-family)',
    ...tokens.map(({ namespace, key, token }) => `${namespaces[namespace]}${key}: var(${token})`),
  ]
    .map((str) => `\n  ${str};`)
    .join('');

/**
 * `inline` makes utilities reference the `--ds-*` variables directly, so data attributes like `data-color`
 * also apply to utilities.
 * @see https://tailwindcss.com/docs/theme#referencing-other-variables
 */
const generateTailwindV4 = (tokens: TailwindToken[]): string => `@theme inline {${toThemeVariables(tokens)}\n}\n`;

const generateTailwindV3 = (tokens: TailwindToken[]): string => {
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

  return `@theme {${toThemeVariables(tokens)}\n}\n${dynamicColors}`;
};
