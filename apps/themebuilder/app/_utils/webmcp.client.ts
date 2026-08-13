/**
 * WebMCP integration – exposes the themebuilder's key actions (reading and
 * updating the theme, exporting the theme config) as tools AI agents can call
 * through the browser's Model Context API.
 *
 * The whole theme state lives in the URL query params, so tools read the
 * current theme from `location.search` and apply changes by navigating.
 *
 * The API surface differs between the spec draft (`document.modelContext`) and
 * Chrome's early preview (`navigator.modelContext`), so we feature-detect both
 * and register through `provideContext` when available, falling back to
 * `registerTool`.
 *
 * @see https://webmachinelearning.github.io/webmcp/
 * @see https://developer.chrome.com/blog/webmcp-epp
 */

import themeConfig from '../../../../designsystemet.config.json';

type WebMcpToolResult = {
  content: { type: 'text'; text: string }[];
};

type WebMcpTool = {
  name: string;
  description: string;
  inputSchema: Record<string, unknown>;
  annotations?: {
    readOnlyHint?: boolean;
  };
  execute: (
    input: Record<string, unknown>,
  ) => WebMcpToolResult | Promise<WebMcpToolResult>;
};

type ModelContext = {
  provideContext?: (context: { tools: WebMcpTool[] }) => void;
  registerTool?: (tool: WebMcpTool) => void | Promise<void>;
};

declare global {
  interface Navigator {
    modelContext?: ModelContext;
  }
  interface Document {
    modelContext?: ModelContext;
  }
}

/* Full page loads also work, but SPA navigation lets the tool call resolve and
 * return its result to the agent instead of being cut off by the unload.
 * Upgraded to the react-router navigate function once the app has hydrated. */
let navigateImpl: (to: string) => void = (to) => window.location.assign(to);

export function setWebMcpNavigate(navigate: (to: string) => void) {
  navigateImpl = navigate;
}

const textResult = (value: unknown): WebMcpToolResult => ({
  content: [
    {
      type: 'text',
      text: typeof value === 'string' ? value : JSON.stringify(value, null, 2),
    },
  ],
});

/* Duplicated from routes/themebuilder/_utils/use-themebuilder.tsx (like
 * config-to-url.ts does) to keep the color-scheme generation code out of the
 * entry chunk */
const QUERY_SEPARATOR = ' ';

const DEFAULT_COLORS = themeConfig.themes.designsystemet.colors;
const SEVERITY_NAMES = ['info', 'success', 'warning', 'danger'] as const;
const TABS = ['examples', 'colorsystem', 'variables'] as const;

const HEX_PATTERN = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i;
const NAME_PATTERN = /^[a-z][a-z0-9-]{0,39}$/;

const currentLang = (): 'en' | 'no' =>
  window.location.pathname.startsWith('/en') ? 'en' : 'no';

/* The theme state lives in the themebuilder page's query params. On other
 * pages (the landing page), fall back to the same defaults as the loader. */
const currentThemeParams = (): URLSearchParams => {
  if (window.location.pathname.endsWith('/themebuilder')) {
    return new URLSearchParams(window.location.search);
  }

  return new URLSearchParams({
    colors: Object.entries(DEFAULT_COLORS)
      .map(([name, hex]) => `${name}:${hex}`)
      .join(QUERY_SEPARATOR),
    appearance: 'light',
    'border-radius': '4',
    tab: 'colorsystem',
  });
};

const parseColorList = (
  value: string | null,
): { name: string; hex: string }[] =>
  (value ?? '')
    .split(QUERY_SEPARATOR)
    .filter(Boolean)
    .map((entry) => {
      const [name, hex] = entry.split(':');
      return { name, hex };
    });

const serializeColorList = (colors: { name: string; hex: string }[]): string =>
  colors.map(({ name, hex }) => `${name}:${hex}`).join(QUERY_SEPARATOR);

const themebuilderUrl = (params: URLSearchParams): string =>
  `/${currentLang()}/themebuilder?${params.toString()}`;

/* Mirrors parseColorOverrides in routes/themebuilder/_utils/use-themebuilder.tsx.
 * Entries look like `<colorname>|<tokenname>|light:<hex>|dark:<hex>` */
const parseColorOverrides = (
  value: string | null,
): Record<string, Record<string, { light?: string; dark?: string }>> => {
  const result: Record<
    string,
    Record<string, { light?: string; dark?: string }>
  > = {};

  for (const entry of (value ?? '').split(QUERY_SEPARATOR)) {
    const [colorName, tokenName, ...modeParts] = entry.split('|');
    if (!colorName || !tokenName || modeParts.length === 0) continue;

    result[colorName] ??= {};
    result[colorName][tokenName] ??= {};

    for (const modePart of modeParts) {
      const [mode, hex] = modePart.split(':');
      if (mode === 'light' || mode === 'dark') {
        result[colorName][tokenName][mode] = hex;
      }
    }
  }

  return result;
};

const themeFromParams = (params: URLSearchParams) => ({
  colors: parseColorList(params.get('colors')),
  severity: parseColorList(params.get('severity')),
  severityEnabled: params.get('severity-enabled') === 'true',
  borderRadius: Number.parseInt(params.get('border-radius') || '4', 10),
  appearance: params.get('appearance') || 'light',
  tab: params.get('tab') || 'colorsystem',
});

const colorInputSchema = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
      description:
        'Color name in lowercase letters, digits and hyphens, e.g. "accent" or "brand1". "neutral" is the reserved neutral color.',
    },
    hex: {
      type: 'string',
      description: 'Hex color value, e.g. "#0062BA".',
    },
  },
  required: ['name', 'hex'],
};

const buildTools = (): WebMcpTool[] => [
  {
    name: 'get-theme',
    description:
      'Get the current theme in the theme builder: main/neutral colors, severity colors, border radius, appearance (light/dark) and a shareable URL.',
    inputSchema: {
      type: 'object',
      properties: {},
    },
    annotations: { readOnlyHint: true },
    execute: () => {
      const params = currentThemeParams();
      return textResult({
        ...themeFromParams(params),
        url: new URL(themebuilderUrl(params), window.location.origin).href,
      });
    },
  },
  {
    name: 'update-theme',
    description:
      'Update the theme in the theme builder. All inputs are optional; provided ones are applied to the current theme and the page navigates to show the result. Colors are merged by name unless "replaceColors" is true. The reserved "neutral" color is always kept.',
    inputSchema: {
      type: 'object',
      properties: {
        colors: {
          type: 'array',
          description: 'Colors to add or update.',
          items: colorInputSchema,
        },
        removeColors: {
          type: 'array',
          description: 'Names of colors to remove.',
          items: { type: 'string' },
        },
        replaceColors: {
          type: 'boolean',
          description:
            'Replace the whole color set with "colors" instead of merging.',
        },
        severity: {
          type: 'array',
          description:
            'Override severity colors. Valid names: info, success, warning, danger.',
          items: colorInputSchema,
        },
        borderRadius: {
          type: 'number',
          description: 'Base border radius in pixels, 0–9999.',
        },
        appearance: {
          type: 'string',
          enum: ['light', 'dark'],
          description: 'Color scheme to preview the theme in.',
        },
        tab: {
          type: 'string',
          enum: [...TABS],
          description: 'Which themebuilder tab to show.',
        },
      },
    },
    execute: (input) => {
      const params = currentThemeParams();
      const errors: string[] = [];

      const readColorArray = (
        value: unknown,
        allowedNames?: readonly string[],
      ) => {
        if (!Array.isArray(value)) return [];
        const colors: { name: string; hex: string }[] = [];
        for (const entry of value) {
          const name = String(
            (entry as Record<string, unknown>)?.name ?? '',
          ).toLowerCase();
          const hex = String(
            (entry as Record<string, unknown>)?.hex ?? '',
          ).toLowerCase();
          if (!NAME_PATTERN.test(name)) {
            errors.push(`Invalid color name "${name}".`);
          } else if (allowedNames && !allowedNames.includes(name)) {
            errors.push(
              `Invalid severity color "${name}". Valid names: ${allowedNames.join(', ')}.`,
            );
          } else if (!HEX_PATTERN.test(hex)) {
            errors.push(`Invalid hex value "${hex}" for color "${name}".`);
          } else {
            colors.push({ name, hex });
          }
        }
        return colors;
      };

      const newColors = readColorArray(input.colors);
      const newSeverity = readColorArray(input.severity, SEVERITY_NAMES);
      const removeColors = Array.isArray(input.removeColors)
        ? input.removeColors.map((name) => String(name).toLowerCase())
        : [];

      if (input.borderRadius !== undefined) {
        const radius = Number(input.borderRadius);
        if (!Number.isFinite(radius) || radius < 0 || radius > 9999) {
          errors.push('"borderRadius" must be a number between 0 and 9999.');
        } else {
          params.set('border-radius', Math.round(radius).toString());
        }
      }

      if (input.appearance !== undefined) {
        if (input.appearance === 'light' || input.appearance === 'dark') {
          params.set('appearance', input.appearance);
        } else {
          errors.push('"appearance" must be "light" or "dark".');
        }
      }

      if (input.tab !== undefined) {
        if (TABS.includes(input.tab as (typeof TABS)[number])) {
          params.set('tab', String(input.tab));
        } else {
          errors.push(`"tab" must be one of: ${TABS.join(', ')}.`);
        }
      }

      if (errors.length > 0) {
        return textResult(`No changes applied:\n${errors.join('\n')}`);
      }

      if (newColors.length > 0 || removeColors.length > 0) {
        const current = parseColorList(params.get('colors'));
        let colors = input.replaceColors === true ? [] : [...current];

        for (const color of newColors) {
          const existing = colors.findIndex((c) => c.name === color.name);
          if (existing >= 0) {
            colors[existing] = color;
          } else {
            colors.push(color);
          }
        }

        colors = colors.filter((c) => !removeColors.includes(c.name));

        // A theme always needs the reserved neutral color
        if (!colors.some((c) => c.name === 'neutral')) {
          const neutral =
            current.find((c) => c.name === 'neutral')?.hex ??
            DEFAULT_COLORS.neutral;
          colors.push({ name: 'neutral', hex: neutral });
        }

        params.set('colors', serializeColorList(colors));
      }

      if (newSeverity.length > 0) {
        const current = parseColorList(params.get('severity'));
        const severity = [...current];

        for (const color of newSeverity) {
          const existing = severity.findIndex((c) => c.name === color.name);
          if (existing >= 0) {
            severity[existing] = color;
          } else {
            severity.push(color);
          }
        }

        params.set('severity', serializeColorList(severity));
        params.set('severity-enabled', 'true');
      }

      const url = themebuilderUrl(params);
      navigateImpl(url);

      return textResult({
        message: 'Theme updated.',
        ...themeFromParams(params),
        url: new URL(url, window.location.origin).href,
      });
    },
  },
  {
    name: 'get-theme-config',
    description:
      'Export the current theme as a designsystemet.config.json snippet, with the CLI commands that generate design tokens and CSS variables from it.',
    inputSchema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          description:
            'Name of the theme in the generated config. Defaults to "theme".',
        },
      },
    },
    annotations: { readOnlyHint: true },
    execute: (input) => {
      const rawName = String(input.name ?? 'theme').toLowerCase();
      const name = NAME_PATTERN.test(rawName) ? rawName : 'theme';

      const params = currentThemeParams();
      const theme = themeFromParams(params);

      const colors = Object.fromEntries(
        theme.colors.map(({ name: colorName, hex }) => [colorName, hex]),
      );
      const severity = Object.fromEntries(
        theme.severity.map(({ name: severityName, hex }) => [
          severityName,
          hex,
        ]),
      );
      const colorOverrides = parseColorOverrides(params.get('color-overrides'));
      const hasOverrides =
        theme.severity.length > 0 || Object.keys(colorOverrides).length > 0;

      const config = {
        $schema: 'node_modules/@digdir/designsystemet/dist/config.schema.json',
        outDir: './design-tokens',
        themes: {
          [name]: {
            colors,
            ...(hasOverrides && {
              overrides: {
                ...(theme.severity.length > 0 && { severity }),
                ...(Object.keys(colorOverrides).length > 0 && {
                  colors: colorOverrides,
                }),
              },
            }),
            borderRadius: theme.borderRadius,
          },
        },
      };

      const packageWithTag = `@digdir/designsystemet${
        window.location.hostname === 'theme.designsystemet.no'
          ? '@latest'
          : '@next'
      }`;

      return textResult({
        instructions:
          'Save the config as designsystemet.config.json in your project root, then run the commands to generate design tokens and CSS variables.',
        config,
        commands: [
          `npx ${packageWithTag} tokens create --config designsystemet.config.json`,
          `npx ${packageWithTag} tokens build --config designsystemet.config.json`,
        ],
      });
    },
  },
];

let registered = false;

export function registerWebMcpTools() {
  const modelContext = navigator.modelContext ?? document.modelContext;
  if (!modelContext || registered) return;
  registered = true;

  const tools = buildTools();

  if (typeof modelContext.provideContext === 'function') {
    modelContext.provideContext({ tools });
  } else if (typeof modelContext.registerTool === 'function') {
    for (const tool of tools) {
      void modelContext.registerTool(tool);
    }
  }
}
