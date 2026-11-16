import {
  createContext,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
  useContext,
  useMemo,
  useState,
} from 'react';
import { type ColorTheme, resolveThemeColors } from './theme-colors';
import {
  type ThemeWorkspace,
  updateActiveTheme,
  type WorkspaceTheme,
} from './theme-workspace';

type ThemeStore = {
  /** Every color of the theme that is shown, in the order of the config */
  colors: ColorTheme[];
  /** The config being edited and the theme that is shown. This is the only theme state in the theme builder. */
  workspace: ThemeWorkspace;
  setWorkspace: Dispatch<SetStateAction<ThemeWorkspace>>;
  /** The theme that is shown */
  theme: WorkspaceTheme;
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
  const theme = workspace.config.themes[workspace.activeTheme];

  const store = useMemo(
    () => ({
      workspace,
      setWorkspace,
      theme,
      updateTheme: (update: (theme: WorkspaceTheme) => WorkspaceTheme) =>
        setWorkspace((previous) => updateActiveTheme(previous, update)),
      colors: resolveThemeColors(theme),
    }),
    [workspace, theme],
  );

  return <ThemeStoreContext value={store}>{children}</ThemeStoreContext>;
}

export function useThemeStore() {
  const store = useContext(ThemeStoreContext);
  if (!store) throw new Error('useThemeStore needs a ThemeStoreProvider');
  return store;
}
