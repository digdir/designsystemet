import { defaultBorderRadius } from '@digdir/designsystemet/internal';
import {
  createContext,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
  useContext,
  useMemo,
  useState,
} from 'react';
import { resolveThemeColors, type ThemeColor } from './theme-colors';
import {
  type ThemeWorkspace,
  updateActiveTheme,
  type WorkspaceTheme,
} from './theme-workspace';

type ThemeStore = {
  /** Every color of the theme that is shown, in the order of the config */
  colors: ThemeColor[];
  /** The config being edited and the theme that is shown. This is the only theme state in the theme builder. */
  workspace: ThemeWorkspace;
  setWorkspace: Dispatch<SetStateAction<ThemeWorkspace>>;
  /** Replaces the config with one from outside, such as an imported file */
  replaceWorkspace: (workspace: ThemeWorkspace) => void;
  /** Counts how many times the config has been replaced. Editors use it to start over, since what they were editing is gone. */
  revision: number;
  /** The theme that is shown */
  theme: WorkspaceTheme;
  /** The base border radius of the theme that is shown, in px */
  borderRadius: number;
  /** Edits the theme that is shown, see `updateActiveTheme` */
  updateTheme: (update: (theme: WorkspaceTheme) => WorkspaceTheme) => void;
};

const ThemeStoreContext = createContext<ThemeStore | null>(null);

/**
 * Holds the config in memory. It is not saved anywhere: users download the config file to keep
 * their work, and import it to continue. `initial` is only read on the first render.
 */
export function ThemeStoreProvider({
  initial,
  children,
}: {
  initial: ThemeWorkspace;
  children: ReactNode;
}) {
  const [workspace, setWorkspace] = useState(initial);
  const [revision, setRevision] = useState(0);
  const theme = workspace.config.themes[workspace.activeTheme];

  /* The scales only depend on the colors and their overrides. Edits keep the parts of a theme they do not
   * change, so other edits, such as the border radius, do not regenerate them. */
  const { colors: themeColors, overrides } = theme;
  const colors = useMemo(
    () => resolveThemeColors({ colors: themeColors, overrides }),
    [themeColors, overrides],
  );

  const store = useMemo(
    () => ({
      workspace,
      setWorkspace,
      replaceWorkspace: (workspace: ThemeWorkspace) => {
        setWorkspace(workspace);
        setRevision((previous) => previous + 1);
      },
      revision,
      theme,
      updateTheme: (update: (theme: WorkspaceTheme) => WorkspaceTheme) =>
        setWorkspace((previous) => updateActiveTheme(previous, update)),
      colors,
      borderRadius: theme.borderRadius ?? defaultBorderRadius,
    }),
    [workspace, theme, colors, revision],
  );

  return <ThemeStoreContext value={store}>{children}</ThemeStoreContext>;
}

export function useThemeStore() {
  const store = useContext(ThemeStoreContext);
  if (!store) throw new Error('useThemeStore needs a ThemeStoreProvider');
  return store;
}
