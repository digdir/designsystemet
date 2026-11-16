import {
  isHexColor,
  semanticColorNames,
} from '@digdir/designsystemet/internal';
import LZString from 'lz-string';
import { importConfig } from './import-config';
import { legacyThemeKeys } from './legacy-url';
import { resolveThemeColors } from './theme-colors';
import {
  defaultWorkspace,
  normalizeConfig,
  type ThemeWorkspace,
  type WorkspaceTheme,
} from './theme-workspace';

/**
 * The theme builder used to keep the theme in the URL. It no longer does, but links that were shared
 * before must keep opening the same theme. This file only reads those links, on the server; nothing writes them.
 *
 * Three generations of links exist:
 * - `config` (the whole config, compressed) and `theme` (the active theme)
 * - `colors`, `severity`, `color-overrides` and `border-radius` for a single theme
 * - `main`, `support` and `neutral`, the predecessors of `colors`
 */

/** Reads `name:hex name:hex` */
const readColors = (value: string | null) =>
  Object.fromEntries(
    (value || '')
      .split(' ')
      .filter(Boolean)
      .map((entry) => entry.split(':')),
  );

/**
 * Reads `color|step|light:hex|dark:hex color|step|dark:hex`.
 * Steps that do not exist and values that are not hex colors are left out, as they cannot be shown.
 */
function readColorOverrides(value: string | null) {
  const overrides: NonNullable<
    NonNullable<WorkspaceTheme['overrides']>['colors']
  > = {};
  for (const entry of (value || '').split(' ')) {
    const [colorName, stepName, ...modes] = entry.split('|');
    const step = semanticColorNames.find((name) => name === stepName);
    // `__proto__` as a key would reach the prototype of every object
    if (!colorName || colorName === '__proto__' || !step) continue;
    for (const mode of modes) {
      const [scheme, hex] = mode.split(':');
      if ((scheme !== 'light' && scheme !== 'dark') || !isHexColor(hex || ''))
        continue;
      overrides[colorName] ??= {};
      overrides[colorName][step] = {
        ...overrides[colorName][step],
        [scheme]: hex,
      };
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
    const result = importConfig(decoded);
    if (!('config' in result)) throw new Error('Invalid config');
    const { config } = result;
    const activeTheme = params.get('theme') || Object.keys(config.themes)[0];
    if (!Object.hasOwn(config.themes, activeTheme))
      throw new Error('Unknown theme');
    return { config, activeTheme };
  } catch {
    throw new Error('Invalid theme builder URL');
  }
}

/**
 * Returns the theme a shared link holds, or `null` when the URL holds no theme.
 * Throws when the link holds a theme that cannot be shown, such as a corrupt config or a color that is not a color.
 */
export function readLegacyUrl(params: URLSearchParams): ThemeWorkspace | null {
  if (params.has('config')) return readCompressedConfig(params);
  if (!legacyThemeKeys.some((key) => params.has(key))) return null;

  try {
    const workspace = readThemeParams(params);
    // Resolving the colors fails for a value that is not a color. Better here than while the page renders.
    Object.values(workspace.config.themes).forEach(resolveThemeColors);
    return workspace;
  } catch {
    throw new Error('Invalid theme builder URL');
  }
}

function readThemeParams(params: URLSearchParams): ThemeWorkspace {
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
