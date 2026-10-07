import {
  type ExternalConfigSchemaInput,
  externalConfigSchema,
} from '@digdir/designsystemet/internal';
import LZString from 'lz-string';
import { parseColorOverrides } from '../routes/themebuilder/_utils/use-themebuilder';
import { configThemeToUrl } from './config-to-url';

export type WorkspaceTheme = NonNullable<
  ExternalConfigSchemaInput['themes']
>[string];

/** A config in the theme builder always has at least one theme, unlike the public config where `themes` is optional. */
export type WorkspaceConfig = ExternalConfigSchemaInput & {
  themes: Record<string, WorkspaceTheme>;
};

export type ThemeWorkspace = { config: WorkspaceConfig; activeTheme: string };

export const isValidThemeName = (name: string) =>
  /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(name);

/**
 * Renames, adds and removes themes in a single update.
 * `from` is the current name of the theme, or `null` for a new theme, which starts as a copy of the active theme.
 * Themes left out of `entries` are removed. Themes keep their order, and the active theme follows its rename,
 * or falls back to the first theme when it is removed.
 */
export function renameWorkspaceThemes(
  workspace: ThemeWorkspace,
  entries: { from: string | null; name: string }[],
): ThemeWorkspace {
  const names = entries.map((entry) => entry.name);
  if (!names.length) throw new Error('A workspace needs at least one theme');
  if (!names.every(isValidThemeName)) throw new Error('Invalid theme name');
  if (new Set(names).size !== names.length)
    throw new Error('Theme already exists');
  const themes: WorkspaceConfig['themes'] = {};
  let activeTheme = names[0];
  for (const { from, name } of entries) {
    if (from !== null && !Object.hasOwn(workspace.config.themes, from))
      throw new Error('Unknown theme');
    themes[name] =
      from === null
        ? structuredClone(workspace.config.themes[workspace.activeTheme])
        : workspace.config.themes[from];
    if (from === workspace.activeTheme) activeTheme = name;
  }
  return { config: { ...workspace.config, themes }, activeTheme };
}

export function addWorkspaceTheme(
  workspace: ThemeWorkspace,
  name: string,
): ThemeWorkspace {
  if (!isValidThemeName(name)) throw new Error('Invalid theme name');
  if (Object.hasOwn(workspace.config.themes, name))
    throw new Error('Theme already exists');
  return {
    config: {
      ...workspace.config,
      themes: {
        ...workspace.config.themes,
        [name]: structuredClone(workspace.config.themes[workspace.activeTheme]),
      },
    },
    activeTheme: name,
  };
}

const themeKeys = [
  'colors',
  'severity',
  'severity-enabled',
  'color-overrides',
  'border-radius',
];

export function readWorkspace(params: URLSearchParams): ThemeWorkspace | null {
  const encoded = params.get('config');
  if (!params.has('config')) return null;
  try {
    const decoded = LZString.decompressFromEncodedURIComponent(encoded || '');
    if (!decoded || decoded.length > 1_000_000)
      throw new Error('Invalid config');
    const config: WorkspaceConfig = JSON.parse(decoded);
    externalConfigSchema.parse(config);
    if (!config.themes) throw new Error('Missing themes');
    const names = Object.keys(config.themes);
    const activeTheme = params.get('theme') || names[0];
    if (!activeTheme || !Object.hasOwn(config.themes, activeTheme))
      throw new Error('Unknown theme');
    return { config, activeTheme };
  } catch {
    throw new Error('Invalid theme workspace URL');
  }
}

export function workspaceParams(
  workspace: ThemeWorkspace,
  params = new URLSearchParams(),
) {
  const next = new URLSearchParams(params);
  for (const key of themeKeys) {
    if (key !== 'severity-enabled') next.delete(key);
  }
  next.set(
    'config',
    LZString.compressToEncodedURIComponent(JSON.stringify(workspace.config)),
  );
  next.set('theme', workspace.activeTheme);
  return next;
}

export function workspaceToUrl(
  config: WorkspaceConfig,
  activeTheme: string,
  lang = 'no',
) {
  return `/${lang}?${workspaceParams({ config, activeTheme }, new URLSearchParams({ appearance: 'light', tab: 'colorsystem' }))}`;
}

export function editorParams(params: URLSearchParams) {
  const workspace = readWorkspace(params);
  if (!workspace) return new URLSearchParams(params);
  const themeParams = new URL(
    configThemeToUrl(workspace.config.themes[workspace.activeTheme]),
    'https://themebuilder.local',
  ).searchParams;
  const next = new URLSearchParams(params);
  for (const key of themeKeys) {
    if (key === 'severity-enabled' && params.has(key)) continue;
    next.delete(key);
    const value = themeParams.get(key);
    if (value !== null) next.set(key, value);
  }
  return next;
}

export function updateWorkspace(
  params: URLSearchParams,
  edited: URLSearchParams,
) {
  const workspace = readWorkspace(params);
  if (!workspace) return edited;
  const previous = workspace.config.themes[workspace.activeTheme];
  const colors = Object.fromEntries(
    (edited.get('colors') || '')
      .split(' ')
      .filter(Boolean)
      .map((entry) => entry.split(':')),
  );
  const severity = Object.fromEntries(
    (edited.get('severity') || '')
      .split(' ')
      .filter(Boolean)
      .map((entry) => entry.split(':')),
  );
  const overrides = {
    ...previous.overrides,
    colors: parseColorOverrides(edited.get('color-overrides')),
  };
  delete overrides.severity;
  if (edited.get('severity-enabled') === 'true' && Object.keys(severity).length)
    overrides.severity = severity;
  const active = {
    ...previous,
    colors,
    overrides,
    borderRadius: Number(edited.get('border-radius') || 4),
  };
  const removed = Object.keys(previous.colors).filter(
    (name) => !Object.hasOwn(colors, name),
  );
  const added = Object.keys(colors).filter(
    (name) => !Object.hasOwn(previous.colors, name),
  );
  const renamed =
    removed.length === 1 &&
    added.length === 1 &&
    Object.keys(previous.colors).length === Object.keys(colors).length;
  const themes = Object.fromEntries(
    Object.entries(workspace.config.themes).map(([name, theme]) => {
      if (name !== workspace.activeTheme && !removed.length && !added.length)
        return [name, theme];
      const updated: WorkspaceTheme =
        name === workspace.activeTheme
          ? active
          : {
              ...theme,
              colors: { ...theme.colors },
              overrides: {
                ...theme.overrides,
                colors: { ...theme.overrides?.colors },
              },
            };
      for (const colorName of added) {
        if (name !== workspace.activeTheme)
          updated.colors[colorName] = renamed
            ? theme.colors[removed[0]]
            : colors[colorName];
      }
      const colorOverrides = updated.overrides?.colors;
      for (const colorName of removed) {
        if (renamed && colorOverrides?.[colorName])
          colorOverrides[added[0]] = colorOverrides[colorName];
        delete updated.colors[colorName];
        delete colorOverrides?.[colorName];
      }
      if (colorOverrides && Object.keys(colorOverrides).length === 0)
        delete updated.overrides?.colors;
      if (updated.overrides && Object.keys(updated.overrides).length === 0)
        delete updated.overrides;
      return [name, updated];
    }),
  );
  return workspaceParams(
    { ...workspace, config: { ...workspace.config, themes } },
    edited,
  );
}
