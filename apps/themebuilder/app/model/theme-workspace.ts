import {
  type ColorScheme,
  colorNameSchema,
  type ExternalConfigSchemaInput,
  type SemanticColorNames,
  severityColors,
  themeNameSchema,
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

const isSeverityColor = (name: string) => Object.hasOwn(severityColors, name);

/**
 * Whether a color can be renamed. Severity colors cannot for now:
 * the CLI adds the severity colors a theme lacks, so a renamed one would come back next to its new name.
 * This can be removed when the CLI no longer adds them.
 */
export const canRenameColor = (name: string) => !isSeverityColor(name);

/**
 * Whether a color can be removed. `names` are the names of the theme's colors.
 * The CLI needs at least one color that is not a severity color, so the last one cannot be removed.
 */
export const canRemoveColor = (names: string[], name: string) =>
  isSeverityColor(name) ||
  names.some((other) => other !== name && !isSeverityColor(other));

/** The CLI's rule for the name of a color: lowercase letters and digits, with single hyphens between them */
const isValidColorName = (name: string) =>
  colorNameSchema.safeParse(name).success;

/**
 * Makes typed text a color name: spaces become hyphens, and characters the CLI does not allow in a color name are removed.
 * The result can still be invalid while it is typed, such as `my-` on the way to `my-brand`; see `colorNameError`.
 */
export const sanitizeColorName = (text: string) =>
  text
    .replace(/\s+/g, '-')
    .replace(/[^A-Z0-9-]+/gi, '')
    .toLowerCase();

/**
 * Why a color cannot be given a name, or `null` when it can.
 * `names` are the names of the theme's colors, and `current` the name the color has now.
 */
export const colorNameError = (
  name: string,
  names: string[],
  current: string,
): 'empty' | 'invalid' | 'duplicate' | null => {
  if (!name.trim()) return 'empty';
  if (!isValidColorName(name)) return 'invalid';
  if (name !== current && names.includes(name)) return 'duplicate';
  return null;
};

/** A name for a new color that no color has: `color-1`, `color-2` and so on */
export const newColorName = (names: string[]) => {
  let suffix = 1;
  while (names.includes(`color-${suffix}`)) suffix++;
  return `color-${suffix}`;
};

/** Whether a name can be used for a theme. The rule is the CLI's rule for theme names. */
export const isValidThemeName = (name: string) =>
  themeNameSchema.safeParse(name).success;

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

/**
 * The workspace the theme builder starts with: one theme named `theme` with the colors of the Designsystemet theme
 * and the default severity colors. Severity colors are colors like any other, and can be changed or removed.
 */
export const defaultWorkspace = (): ThemeWorkspace => ({
  activeTheme: 'theme',
  config: {
    themes: {
      theme: {
        colors: {
          ...defaultConfig.themes.designsystemet.colors,
          ...severityColors,
        },
      },
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
      if (!removed.length && !added.length) {
        if (!isActive) return [themeName, theme];
        /* Overrides the edit did not touch are kept as the same object, so that what is derived from them is not made again */
        const untouched = active.overrides === previous.overrides;
        return [themeName, untouched ? active : pruneOverrides(active)];
      }

      const colors = isActive
        ? active.colors
        : Object.fromEntries(
            Object.entries(theme.colors).flatMap(([name, value]) => {
              if (renamed && name === removed[0]) return [[added[0], value]];
              return removed.includes(name) ? [] : [[name, value]];
            }),
          );
      for (const name of added) {
        if (!Object.hasOwn(colors, name)) colors[name] = active.colors[name];
      }

      const source = isActive ? active : theme;
      const colorOverrides = { ...source.overrides?.colors };
      for (const name of removed) {
        if (renamed && Object.hasOwn(colorOverrides, name))
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
 * A color keeps its position when it is renamed. The edit is ignored when `current` is not a color of the theme,
 * when the new name is taken by another color, and when the color cannot be renamed (see `canRenameColor`).
 */
export function setThemeColor(
  theme: WorkspaceTheme,
  current: string | undefined,
  name: string,
  hex: string,
): WorkspaceTheme {
  const isNew = current === undefined;
  if (!isNew && !Object.hasOwn(theme.colors, current)) return theme;
  if (
    name !== current &&
    (Object.hasOwn(theme.colors, name) || (!isNew && !canRenameColor(current)))
  )
    return theme;
  const entries = Object.entries(theme.colors);
  const colors = Object.fromEntries(
    isNew
      ? [...entries, [name, hex]]
      : entries.map((entry) => (entry[0] === current ? [name, hex] : entry)),
  );
  return { ...theme, colors };
}

/** Removes a color, unless it cannot be removed (see `canRemoveColor`). */
export function removeThemeColor(
  theme: WorkspaceTheme,
  name: string,
): WorkspaceTheme {
  if (!canRemoveColor(Object.keys(theme.colors), name)) return theme;
  const { [name]: _, ...colors } = theme.colors;
  return { ...theme, colors };
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

/**
 * Makes a config from a file or an old link fit the theme builder, where severity colors are ordinary colors:
 * - `overrides.severity` is moved into `colors`
 * - the default severity colors are added to themes that lack them, since the CLI adds them to such a theme when it builds it
 */
export function normalizeConfig(config: WorkspaceConfig): WorkspaceConfig {
  const themes = Object.fromEntries(
    Object.entries(config.themes).map(([name, theme]) => {
      const { severity, ...overrides } = { ...theme.overrides };
      return [
        name,
        pruneOverrides({
          ...theme,
          colors: Object.assign(
            { ...theme.colors },
            ...Object.entries(severityColors).map(([name, hex]) => ({
              [name]:
                severity?.[name as keyof typeof severity] ||
                theme.colors[name] ||
                hex,
            })),
          ),
          overrides,
        }),
      ];
    }),
  );
  return { ...config, themes };
}
