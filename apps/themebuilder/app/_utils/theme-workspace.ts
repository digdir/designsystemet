import {
  type ColorScheme,
  type ExternalConfigSchemaInput,
  RESERVED_COLORS,
  type SemanticColorNames,
  severityColors,
} from '@digdir/designsystemet/internal';
import defaultConfig from '../../../../designsystemet.config.json';

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

/** The workspace the theme builder starts with: one theme named `theme` with the colors of the Designsystemet theme. */
export const defaultWorkspace = (): ThemeWorkspace => ({
  activeTheme: 'theme',
  config: {
    themes: {
      theme: { colors: { ...defaultConfig.themes.designsystemet.colors } },
    },
  },
});

/** Removes empty `overrides` objects, so an edited theme does not leave them behind in the config. */
function pruneOverrides(theme: WorkspaceTheme): WorkspaceTheme {
  if (!theme.overrides) return theme;
  const overrides = { ...theme.overrides };
  if (overrides.colors) {
    const colors = Object.fromEntries(
      Object.entries(overrides.colors)
        .map(([name, steps]) => [
          name,
          Object.fromEntries(
            Object.entries(steps).filter(
              ([, modes]) => modes && Object.keys(modes).length,
            ),
          ),
        ])
        .filter(([, steps]) => Object.keys(steps).length),
    );
    if (Object.keys(colors).length) overrides.colors = colors;
    else delete overrides.colors;
  }
  if (overrides.severity && !Object.keys(overrides.severity).length)
    delete overrides.severity;
  const { overrides: _, ...rest } = theme;
  return Object.keys(overrides).length ? { ...rest, overrides } : rest;
}

/**
 * Edits the active theme. Every theme in a config has the same color names, so a color that the edit
 * adds, removes or renames is added, removed or renamed in the other themes too.
 * A renamed color keeps each theme's own value and step overrides.
 */
export function updateActiveTheme(
  workspace: ThemeWorkspace,
  update: (theme: WorkspaceTheme) => WorkspaceTheme,
): ThemeWorkspace {
  const previous = workspace.config.themes[workspace.activeTheme];
  const active = update(previous);
  if (active === previous) return workspace;
  const removed = Object.keys(previous.colors).filter(
    (name) => !Object.hasOwn(active.colors, name),
  );
  const added = Object.keys(active.colors).filter(
    (name) => !Object.hasOwn(previous.colors, name),
  );
  const renamed = removed.length === 1 && added.length === 1;

  const themes = Object.fromEntries(
    Object.entries(workspace.config.themes).map(([themeName, theme]) => {
      const isActive = themeName === workspace.activeTheme;
      if (!removed.length && !added.length)
        return [themeName, isActive ? pruneOverrides(active) : theme];

      const colors = isActive
        ? active.colors
        : Object.fromEntries(
            Object.entries(theme.colors).flatMap(([name, value]) => {
              if (renamed && name === removed[0]) return [[added[0], value]];
              return removed.includes(name) ? [] : [[name, value]];
            }),
          );
      for (const name of added) colors[name] ??= active.colors[name];

      const source = isActive ? active : theme;
      const colorOverrides = { ...source.overrides?.colors };
      for (const name of removed) {
        if (renamed && colorOverrides[name])
          colorOverrides[added[0]] = colorOverrides[name];
        delete colorOverrides[name];
      }
      return [
        themeName,
        pruneOverrides({
          ...source,
          colors,
          overrides: { ...source.overrides, colors: colorOverrides },
        }),
      ];
    }),
  );
  return { ...workspace, config: { ...workspace.config, themes } };
}

/**
 * Sets the name and base color of a color. `current` is the name the color has now, or `undefined` for a new color.
 * A color keeps its position when it is renamed. The edit is ignored when the new name is reserved or taken by another color.
 */
export function setThemeColor(
  theme: WorkspaceTheme,
  current: string | undefined,
  name: string,
  hex: string,
): WorkspaceTheme {
  const exists = current !== undefined && Object.hasOwn(theme.colors, current);
  if (
    name !== current &&
    (Object.hasOwn(theme.colors, name) || RESERVED_COLORS.includes(name))
  )
    return theme;
  const entries = Object.entries(theme.colors);
  const colors = Object.fromEntries(
    exists
      ? entries.map((entry) => (entry[0] === current ? [name, hex] : entry))
      : [...entries, [name, hex]],
  );
  return { ...theme, colors };
}

export function removeThemeColor(
  theme: WorkspaceTheme,
  name: string,
): WorkspaceTheme {
  const { [name]: _, ...colors } = theme.colors;
  return { ...theme, colors };
}

/** Replaces a severity color. Setting it to the default color removes the replacement. */
export function setSeverityColor(
  theme: WorkspaceTheme,
  name: keyof typeof severityColors,
  hex: string,
): WorkspaceTheme {
  const { [name]: _, ...severity } = { ...theme.overrides?.severity };
  if (hex.toLowerCase() !== severityColors[name].toLowerCase())
    Object.assign(severity, { [name]: hex });
  return pruneOverrides({
    ...theme,
    overrides: { ...theme.overrides, severity },
  });
}

/** Overrides one step of a color in one color scheme. An empty `hex` removes the override. */
export function setColorOverride(
  theme: WorkspaceTheme,
  colorName: string,
  step: SemanticColorNames,
  scheme: ColorScheme,
  hex: string,
): WorkspaceTheme {
  const colors = theme.overrides?.colors;
  const { [scheme]: _, ...modes } = { ...colors?.[colorName]?.[step] };
  if (hex) Object.assign(modes, { [scheme]: hex });
  return pruneOverrides({
    ...theme,
    overrides: {
      ...theme.overrides,
      colors: {
        ...colors,
        [colorName]: { ...colors?.[colorName], [step]: modes },
      },
    },
  });
}
