import {
  externalConfigSchema,
  type SemanticColorNames,
} from '@digdir/designsystemet/internal';
import LZString from 'lz-string';
import {
  defaultWorkspace,
  normalizeConfig,
  type ThemeWorkspace,
  type WorkspaceConfig,
  type WorkspaceTheme,
} from './theme-workspace';

/**
 * The theme builder used to keep the theme in the URL. It no longer does, but links that were shared
 * before must keep opening the same theme. This file only reads those links; nothing writes them.
 *
 * Three generations of links exist:
 * - `config` (the whole config, compressed) and `theme` (the active theme)
 * - `colors`, `severity`, `color-overrides` and `border-radius` for a single theme
 * - `main`, `support` and `neutral`, the predecessors of `colors`
 */
export const legacyThemeKeys = [
  'config',
  'theme',
  'colors',
  'severity',
  'severity-enabled',
  'color-overrides',
  'border-radius',
  'main',
  'support',
  'neutral',
];

/** Reads `name:hex name:hex` */
const readColors = (value: string | null) =>
  Object.fromEntries(
    (value || '')
      .split(' ')
      .filter(Boolean)
      .map((entry) => entry.split(':')),
  );

/** Reads `color|step|light:hex|dark:hex color|step|dark:hex` */
function readColorOverrides(value: string | null) {
  const overrides: NonNullable<
    NonNullable<WorkspaceTheme['overrides']>['colors']
  > = {};
  for (const entry of (value || '').split(' ')) {
    const [colorName, step, ...modes] = entry.split('|') as [
      string,
      SemanticColorNames,
      ...string[],
    ];
    if (!colorName || !step) continue;
    for (const mode of modes) {
      const [scheme, hex] = mode.split(':');
      if (scheme !== 'light' && scheme !== 'dark') continue;
      overrides[colorName] ??= {};
      overrides[colorName][step] ??= {};
      overrides[colorName][step][scheme] = hex;
    }
  }
  return overrides;
}

function readCompressedConfig(params: URLSearchParams): ThemeWorkspace {
  try {
    const decoded = LZString.decompressFromEncodedURIComponent(
      params.get('config') || '',
    );
    if (!decoded || decoded.length > 1_000_000)
      throw new Error('Invalid config');
    const config: WorkspaceConfig = JSON.parse(decoded);
    externalConfigSchema.parse(config);
    if (!config.themes) throw new Error('Missing themes');
    const activeTheme = params.get('theme') || Object.keys(config.themes)[0];
    if (!activeTheme || !Object.hasOwn(config.themes, activeTheme))
      throw new Error('Unknown theme');
    return { config: normalizeConfig(config), activeTheme };
  } catch {
    throw new Error('Invalid theme builder URL');
  }
}

/**
 * Returns the theme a shared link holds, or `null` when the URL holds no theme.
 * Throws when the URL has a compressed config that cannot be read.
 */
export function readLegacyUrl(params: URLSearchParams): ThemeWorkspace | null {
  if (params.has('config')) return readCompressedConfig(params);
  if (!legacyThemeKeys.some((key) => params.has(key))) return null;

  const workspace = defaultWorkspace();
  const theme = workspace.config.themes[workspace.activeTheme];

  const neutral = params.get('neutral');
  const colors = params.has('colors')
    ? readColors(params.get('colors'))
    : {
        ...readColors(params.get('main')),
        ...readColors(params.get('support')),
        ...(neutral && { neutral }),
      };
  // Old links never held the severity colors, only replacements for them
  if (Object.keys(colors).length) theme.colors = colors;

  const severity = readColors(params.get('severity'));
  const colorOverrides = readColorOverrides(params.get('color-overrides'));
  const overrides = {
    ...(Object.keys(colorOverrides).length && { colors: colorOverrides }),
    ...(Object.keys(severity).length && { severity }),
  };
  if (Object.keys(overrides).length) theme.overrides = overrides;

  const borderRadius = Number.parseInt(params.get('border-radius') || '', 10);
  if (borderRadius >= 0) theme.borderRadius = borderRadius;

  return { ...workspace, config: normalizeConfig(workspace.config) };
}
