import type { WorkspaceConfig } from './theme-workspace';

/**
 * A shared theme has two links, see `shared-themes.server.ts`:
 * - `?id=<id>` opens it for editing: the changes made there are saved to it
 * - `?view=<view id>` opens it for viewing: the changes made there stay in the browser
 */
export const SHARED_THEME_PARAM = 'id';
export const SHARED_VIEW_PARAM = 'view';

/** The ids of a shared theme. Neither can be worked out from the other. */
export type SharedThemeIds = { id: string; viewId: string };

/**
 * An id is ten random letters and digits. It is all it takes to open and change a theme, so it must be
 * too long to guess: there are 62^10, about 8 x 10^17, of them.
 */
export const SHARED_THEME_ID_LENGTH = 10;
export const SHARED_THEME_ID_CHARACTERS =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

export const isSharedThemeId = (id: string) => /^[A-Za-z0-9]{10}$/.test(id);

/** Where themes are shared (`POST`) and updated (`PUT` to `/<id>`), and the largest config that can be shared, in bytes */
export const SHARE_THEME_PATH = '/api/themes';
export const MAX_SHARED_THEME_BYTES = 100_000;

export type ShareThemeResult =
  | SharedThemeIds
  | { error: 'invalid' | 'too-large' | 'rate-limited' | 'not-found' };

/** The most themes a shared config can have, and the most colors each of them can have */
export const MAX_SHARED_THEMES = 20;
export const MAX_SHARED_COLORS = 40;

/**
 * Whether a config has few enough themes and colors to be shared. Every color of a theme is turned into a scale
 * each time the theme is opened, which takes the server seconds for a config with thousands of colors.
 */
export const isWithinShareLimits = (config: WorkspaceConfig) => {
  const themes = Object.values(config.themes);
  return (
    themes.length <= MAX_SHARED_THEMES &&
    themes.every(
      ({ colors }) => Object.keys(colors).length <= MAX_SHARED_COLORS,
    )
  );
};
